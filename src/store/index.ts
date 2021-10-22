import Vue from "vue";
import Vuex from "vuex";
import { RootState, User, UpdateUser, Measurement } from "@/types/types";
import { signOut } from "@/utils";

import axios, { AxiosError } from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

// If a response 401s, we assume the token is invalid and logout
axios.interceptors.response.use(
  response => response,
  error => {
    console.log("intercepted error", error);
    if (error.response.status === 401) {
      signOut();
    }
    return Promise.reject(error);
  },
);

Vue.use(Vuex);

const API_URL = process.env.NODE_ENV === "development" ? process.env.VUE_APP_DATA_API_URL : "/api/v1";

function axiosErrorHandling(error: AxiosError) {
  console.log("Handle Axios error:");
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log("data", error.response.data);
    console.log("status", error.response.status);
    console.log("headers", error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log("error.request", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error something", error.message);
  }
}

function setAuthorizationHeader(): void {
  axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

export default new Vuex.Store<RootState>({
  state: {
    authenticated: false,
    user: {
      id: "",
      email: "",
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
    SIGN_IN: (state, user: User) => {
      state.authenticated = true;
      state.user = user;
    },
    AUTO_SIGN_IN: (state, id: string) => {
      state.authenticated = true;
      state.user.id = id;
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
    oauthSetUser({ commit }, id: string) {
      const user: User = {
        id: id,
        email: "",
        idealWeight: 0,
        measurementSystem: "metric",
        baseDumbbellWeight: 2,
        measurements: [],
      };

      setAuthorizationHeader();
      commit("SIGN_IN", user);
    },
    autoSignIn({ commit }, userId: string) {
      setAuthorizationHeader();
      commit("AUTO_SIGN_IN", userId);
    },
    async fetchUser({ commit, state }) {
      console.log("fetchUser");
      try {
        const response = await axios.get(`${API_URL}/users/${state.user.id}`);
        const user: User = response.data;
        console.log("fetch user resp:", user);
        commit("SET_USER", user);
      } catch (error) {
        const e = error as AxiosError;
        axiosErrorHandling(e);
      }
    },
    async updateUser({ commit, state }, updateUser: UpdateUser = {}) {
      console.log("updateUser", updateUser);

      // Merge updated user properties with existing user
      const user = { ...state.user, ...updateUser };

      try {
        commit("SET_USER", user);
        await axios.post(`${API_URL}/users/${state.user.id}`, user);
      } catch (error) {
        const e = error as AxiosError;
        axiosErrorHandling(e);
      }
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
