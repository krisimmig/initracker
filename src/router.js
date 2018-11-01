import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Encounter from "./views/Encounter.vue";
import Login from "./views/Login.vue";
import About from "./views/About.vue";
import Register from "./views/Register.vue";
import { isLoggedIn } from "./utils/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/encounter",
      name: "encounter",
      component: Encounter,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn()) {
    next({
      name: "login",
      query: { redirect: to.name }
    });
  } else if (isLoggedIn() && ["login", "register"].includes(to.name)) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
