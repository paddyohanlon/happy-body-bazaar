import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { rid } from "@/rethinkid";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    // auto-log in
    const loggedIn = rid.isLoggedIn();

    if (loggedIn && loggedIn.idTokenDecoded) {
      this.$store.dispatch("autoSignIn", loggedIn.idTokenDecoded);
    }
  },
  render: h => h(App),
}).$mount("#app");
