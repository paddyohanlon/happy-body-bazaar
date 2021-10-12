import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Measurements from "../views/Measurements.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/sign-up",
    name: "signUp",
    component: SignUp,
    meta: { requiresAuth: false },
  },
  {
    path: "/sign-in",
    name: "signIn",
    component: SignIn,
    meta: { requiresAuth: false },
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
  },
];

const router = new VueRouter({
  routes,
  linkExactActiveClass: "is-active",
});

router.beforeEach((to, from, next) => {
  // If route requires auth
  if (to.matched.some(record => record.meta.requiresAuth !== false)) {
    if (!localStorage.getItem("token")) {
      // Redirect to the sign in view if no token found and route requires auth
      next({ name: "signUp" });
      return;
    }
  }

  next();
});

export default router;
