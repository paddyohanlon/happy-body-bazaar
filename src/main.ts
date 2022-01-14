import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import jwt_decode from "jwt-decode";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    // auto-sign in
    const token = localStorage.getItem("token");
    const idToken = localStorage.getItem("idToken");

    if (token && idToken) {
      try {
        const idTokenDecoded: { sub: string; email: string; name: string } = jwt_decode(idToken);
        this.$store.dispatch("autoSignIn", idTokenDecoded);
      } catch (error) {
        console.log("token decode error:", error);
        localStorage.removeItem("token");
      }
    }
  },
  render: h => h(App),
}).$mount("#app");
