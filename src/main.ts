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
    console.log("token", token);
    if (token) {
      try {
        const tokenDecoded: { sub: string } = jwt_decode(token);
        console.log("tokenDecoded", tokenDecoded);
        this.$store.dispatch("autoSignIn", tokenDecoded.sub);
      } catch (error) {
        console.log("token decode error:", error);
        localStorage.removeItem("token");
      }
    }
  },
  render: h => h(App),
}).$mount("#app");
