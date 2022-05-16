import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Measurements from "../views/Measurements.vue";
import Profile from "../views/Profile.vue";

import { rid } from "@/rethinkid";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/callback",
    name: "callback",
    meta: { requiresAuth: false },
    async beforeEnter(to, from, next) {
      try {
        await rid.completeLogIn();
        store.dispatch("autoSignIn");
      } catch (e) {
        console.error("Sign in callback error:", e);
      }
      next({ name: "home" });
    },
  },
  {
    path: "/measurements",
    name: "measurements",
    component: Measurements,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: false },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkExactActiveClass: "is-active",
});

router.beforeEach((to, from, next) => {
  // If route requires auth
  if (to.matched.some(record => record.meta.requiresAuth !== false)) {
    if (!rid.isLoggedIn()) {
      // Redirect if no token found and route requires auth
      next({ name: "home" });
      return;
    }
  }

  next();
});

export default router;
