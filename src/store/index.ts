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
    loaded: false,
    authenticated: false,
    openIdConnect: {
      id: "",
      email: "",
      name: "",
    },
    user: DEFAULT_USER,
    userTable: rid.table(USER_TABLE_NAME, {}),
  },
  mutations: {
    SET_USER: (state, user: User) => {
      state.user = user;
    },
    SET_LOADED: (state, loaded: boolean) => {
      state.loaded = loaded;
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
    async autoSignIn({ commit, dispatch }) {
      if (rid.isLoggedIn()) {
        try {
          const user = rid.userInfo();
          commit("SIGN_IN", user);

          await dispatch("fetchUser");
          commit("SET_LOADED", true);
        } catch (e) {
          console.error("tableRead error", e);
        }
      } else {
        commit("SET_LOADED", true);
      }
    },
    async fetchUser({ commit, state }) {
      console.log("fetchUser");

      let noUser = false;

      try {
        const response = await state.userTable.read({ rowId: state.openIdConnect.id });
        if (response.data) {
          console.log("response.data", response.data);
          commit("SET_USER", response.data);
          return;
        } else {
          noUser = true;
        }
      } catch (e) {
        console.log("tableRead error", e);
        noUser = true;
      }

      if (noUser) {
        // Assume table doesn't exist, or user row doesn't exist

        // Set row ID to user ID
        DEFAULT_USER.id = state.openIdConnect.id;

        const result = await rid.tableInsert(USER_TABLE_NAME, DEFAULT_USER);
        console.log("tableInsert result", result);
      }
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      console.log("user", user);

      commit("SET_USER", user);

      const response = await state.userTable.update(user);
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
