import Vue from "vue";
import Vuex from "vuex";
import { RootState, User, AuthUser, SignUp, SignIn, UpdateUser, Measurement, NewMeasurement } from "@/types/types";
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

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api/v1" : "/api/v1";

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
    },
    measurements: [],
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
    SET_MEASUREMENTS: (state, measurements: Measurement[]) => {
      state.measurements = measurements;
    },
    ADD_MEASUREMENT: (state, measurement: Measurement) => {
      if (state.measurements) {
        state.measurements.unshift(measurement);
      } else {
        state.measurements = [measurement];
      }
    },
    DELETE_MEASUREMENT: (state, measurementId: string) => {
      const measurementIndex = state.measurements.findIndex(measurement => measurement.id === measurementId);
      state.measurements.splice(measurementIndex, 1);
    },
  },
  actions: {
    async signUp({ commit }, signUp: SignUp): Promise<string[]> {
      console.log("signUp", signUp);

      try {
        const response = await axios.post(`${API_URL}/sign-up`, signUp);

        console.log("signUp -- response:", response);

        const { token, user }: AuthUser = response.data;
        console.log("signUp -- token:", token);
        console.log("signUp -- user:", user);

        localStorage.setItem("token", token);

        setAuthorizationHeader();

        commit("SIGN_UP", user);
      } catch (error) {
        if (error.response) {
          return [error.response.data.message];
        }
        // axiosErrorHandling(error);
      }

      return [];
    },
    async signIn({ commit }, signIn: SignIn): Promise<string[]> {
      console.log("signIn", signIn);

      try {
        const response = await axios.post(`${API_URL}/sign-in`, signIn);

        console.log("signIn -- response:", response);

        if (response.data.errors) {
          console.log("signIn -- errors:", response.data.errors);
          return response.data.errors.map((error: { message: string }) => error.message);
        }
        const { token, user }: AuthUser = response.data;
        console.log("signIn -- token:", token);
        console.log("signIn -- user:", user);

        localStorage.setItem("token", token);

        setAuthorizationHeader();

        commit("SIGN_IN", user);
      } catch (error) {
        if (error.response) {
          return [error.response.data.message];
        }
        // axiosErrorHandling(error);
      }

      return [];
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
        // console.log("fetch user resp:", user);
        commit("SET_USER", user);
      } catch (error) {
        axiosErrorHandling(error);
      }
    },
    async updateUser({ commit, state }, updateUser: UpdateUser) {
      console.log("updateUser", updateUser);
      try {
        const response = await axios.post(`${API_URL}/users/${state.user.id}`, updateUser);
        const user: User = response.data;
        console.log("update user resp:", user);
        commit("SET_USER", user);
      } catch (error) {
        axiosErrorHandling(error);
      }
    },
    async fetchMeasurements({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/users/${state.user.id}/measurements`);
        const measurements: Measurement[] = response.data;
        console.log("fetch measurements resp:", measurements);
        commit("SET_MEASUREMENTS", measurements);
      } catch (error) {
        axiosErrorHandling(error);
      }
    },
    async addMeasurement({ commit, state }, newMeasurement: NewMeasurement) {
      try {
        console.log("addMeasurement", newMeasurement);
        const response = await axios.post(`${API_URL}/users/${state.user.id}/measurements`, newMeasurement);

        const measurement: Measurement = response.data;
        console.log("addMeasurement -- response:", measurement);

        commit("ADD_MEASUREMENT", measurement);
      } catch (error) {
        axiosErrorHandling(error);
      }
    },
    async deleteMeasurement({ commit, state }, measurementId: string) {
      console.log("deleting measurement", measurementId);

      try {
        await axios.delete(`${API_URL}/users/${state.user.id}/measurements/${measurementId}`);
        commit("DELETE_MEASUREMENT", measurementId);
      } catch (error) {
        axiosErrorHandling(error);
      }
    },
  },
  getters: {},
  modules: {},
});
