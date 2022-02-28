import Vue from "vue";
import Vuex from "vuex";
import { RootState, User, UpdateUser, Measurement, OpenIDConnect } from "@/types/types";
import { rid } from "@/rethinkid";

Vue.use(Vuex);

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

      commit("SIGN_IN", openIdConnect);
    },
    async fetchUser({ commit, state }) {
      console.log("fetchUser");

      try {
        const response = await rid.tableRead(USER_TABLE_NAME, state.openIdConnect.userId);
        if (response.data) {
          commit("SET_USER", response.data);
          return;
        }
      } catch (e) {
        console.log("tableRead error", e);

        // Assume table doesn't exist

        // Set row ID to user ID
        DEFAULT_USER.id = state.openIdConnect.userId;

        const result = await rid.tableInsert(USER_TABLE_NAME, DEFAULT_USER);
        console.log("tableInsert result", result);
      }
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      commit("SET_USER", user);

      const response = await rid.tableUpdate(USER_TABLE_NAME, user);
      console.log("update response", response);
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
