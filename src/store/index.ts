import Vue from "vue";
import Vuex from "vuex";
import socket from "@/socket";
import { RootState, User, UpdateUser, Measurement, OpenIDConnect } from "@/types/types";

Vue.use(Vuex);

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

      const payload = { tableName: USER_TABLE_NAME, rowId: state.openIdConnect.userId };
      socket.emit("table:read", payload, (response: { data?: unknown[]; error?: string }) => {
        console.log("table:read response:", response);

        if (response.data) {
          commit("SET_USER", response.data);
        } else {
          console.log("No user, first time fetching user, so insert user");

          if (response.error) {
            console.log("table:read response.error", response.error);
          }

          // Set row ID to user ID
          DEFAULT_USER.id = state.openIdConnect.userId;

          // Table will be created if doesn't exist
          const payload = { tableName: USER_TABLE_NAME, row: DEFAULT_USER };
          socket.emit("table:insert", payload, (response: { message: string } | { error: string }) => {
            console.log("table:insert: response", response);
          });
        }
      });
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      commit("SET_USER", user);

      const payload = { tableName: USER_TABLE_NAME, row: user };
      socket.emit("table:update", payload, (response: any) => {
        console.log("table:update response", response);
      });
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
});
