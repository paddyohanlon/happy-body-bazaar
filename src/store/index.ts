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

export default new Vuex.Store<RootState>({
  state: {
    authenticated: false,
    openIdConnect: {
      userId: "",
      email: "",
      name: "",
    },
    user: {
      idealWeight: 0,
      measurementSystem: "",
      baseDumbbellWeight: 0,
      measurements: [],
    },
  },
  mutations: {
    SET_USER: (state, user: User) => {
      state.user = user;
    },
    SIGN_UP: (state, user: User) => {
      state.authenticated = true;
      state.user = user;
    },
    SIGN_IN: (state, { openIdConnect, user }: { openIdConnect: OpenIDConnect; user: User }) => {
      state.authenticated = true;
      state.openIdConnect = openIdConnect;
      state.user = user;
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

      const user: User = {
        idealWeight: 0,
        measurementSystem: "metric",
        baseDumbbellWeight: 2,
        measurements: [],
      };

      setSocketAuthToken();
      commit("SIGN_IN", { openIdConnect, user });
    },
    async fetchUser({ commit, state }) {
      console.log("fetchUser");

      // @ts-ignore
      this.$socket.emit("user:read", { userId: state.openIdConnect.userId }, (user: User) => {
        console.log("user", user);
        commit("SET_USER", user);
      });
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      commit("SET_USER", user);

      console.log("emit user:update");

      // @ts-ignore
      this.$socket.emit("user:update", { userId: state.openIdConnect.userId, user: user });
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
