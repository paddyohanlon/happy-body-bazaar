import Vue from "vue";
import Vuex from "vuex";
import createSocketPlugin from "@/socket-store-plugin";
import socket from "@/socket";
import { RootState, User, UpdateUser, Measurement, OpenIDConnect } from "@/types/types";

Vue.use(Vuex);

const socketPlugin = createSocketPlugin(socket);

// Set after sign in
function setSocketAuthToken(): void {
  socket.auth = {
    token: localStorage.getItem("token"),
  };
}

const USER_TABLE_NAME = "my_user_info";

const DEFAULT_USER: User = {
  id: "",
  idealWeight: 0,
  measurementSystem: "metric",
  baseDumbbellWeight: 2,
  measurements: [],
};

export default new Vuex.Store<RootState>({
  state: {
    authenticated: false,
    openIdConnect: {
      userId: "",
      email: "",
      name: "",
    },
    user: DEFAULT_USER,
  },
  mutations: {
    SET_USER: (state, user: User) => {
      state.user = user;
    },
    SIGN_IN: (state, openIdConnect: OpenIDConnect) => {
      state.authenticated = true;
      state.openIdConnect = openIdConnect;
    },
    ADD_MEASUREMENT: (state, measurement: Measurement) => {
      if (state.user.measurements) {
        state.user.measurements.unshift(measurement);
      } else {
        state.user.measurements = [measurement];
      }
    },
    DELETE_MEASUREMENT: (state, index: number) => {
      state.user.measurements.splice(index, 1);
    },
  },
  actions: {
    autoSignIn({ commit }, { sub, email, name }: { sub: string; email: string; name: string }) {
      const openIdConnect = {
        userId: sub,
        email,
        name,
      };

      setSocketAuthToken();
      commit("SIGN_IN", openIdConnect);
    },
    async fetchUser({ commit, state }) {
      console.log("fetchUser");

      // Get table
      // Table will be created if doesn't exist
      const payload = { tableName: USER_TABLE_NAME, tableUserId: state.openIdConnect.userId };
      socket.emit("table:list", payload, (response: { data: unknown[]; socketTableHandle: string }) => {
        console.log("table:list response:", response);

        if (response.data.length > 0) {
          // user data will always be the first and only item
          console.log("setting user from socket.io connection");
          commit("SET_USER", response.data[0]);
        } else {
          console.log("First time fetching user, let's add a row for user info");

          // Set table row ID to user ID
          DEFAULT_USER.id = state.openIdConnect.userId;

          const payload = { userId: state.openIdConnect.userId, tableName: USER_TABLE_NAME, row: DEFAULT_USER };
          socket.emit("table:row:create", payload, (response: { message: string } | { error: string }) => {
            console.log("table:row:create: response", response);
          });
        }
      });
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      commit("SET_USER", user);

      console.log("emit table:row:update");

      const payload = { userId: state.openIdConnect.userId, tableName: USER_TABLE_NAME, row: user };
      socket.emit("table:row:update", payload, (response: any) => {
        console.log("table:row:update response", response);
      });
    },
    updateUserReceived({ commit }, updateUser: UpdateUser) {
      // Received socket.io broadcast
      console.log("updateUserBroadcastReceived", updateUser);
      commit("UPDATE_USER", updateUser);
    },
    async addMeasurement({ commit, dispatch }, measurement: Measurement) {
      console.log("addMeasurement", measurement);
      commit("ADD_MEASUREMENT", measurement);
      dispatch("updateUser");
    },
    async deleteMeasurement({ commit, dispatch }, index: number) {
      console.log("deleting measurement", index);
      commit("DELETE_MEASUREMENT", index);
      dispatch("updateUser");
    },
  },
  getters: {},
  modules: {},
  plugins: [socketPlugin],
});
