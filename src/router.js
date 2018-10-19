import Vue from "vue";
import Router from "vue-router";

import { firebase } from "./store/vuex-easy-firestore";
import Home from "./views/Home.vue";
import Encounter from "./views/Encounter.vue";
import Login from "./views/Login.vue";
import About from "./views/About.vue";
import Register from "./views/Register.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
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
      component: About,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next({
      name: "login",
      query: { redirect: to.name }
    });
  } else if (currentUser && ["login", "register"].includes(to.name)) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
