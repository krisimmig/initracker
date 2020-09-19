import Vue from 'vue';
import Router from 'vue-router';
import { Route } from 'vue-router';

import Home from '@/views/Home.vue';
import Characters from '@/views/Characters.vue';
import CharacterCreate from '@/views/CharacterCreate.vue';
import Encounters from '@/views/Encounters.vue';
import EncounterDetails from '@/views/EncounterDetails.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import { isLoggedIn } from '@/store/firebase';
import UserDetails from '@/views/UserDetails.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'is-activeExact',
  linkActiveClass: 'is-active',

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

    {
      path: '/user',
      name: 'userdetails',
      component: UserDetails,
    },

    {
      path: '/characters',
      name: 'characters',
      component: Characters,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/characters/edit/:uuid',
      name: 'editCharacter',
      component: CharacterCreate,
      meta: {
        requiresAuth: true,
        edit: true,
      },
    },

    {
      path: '/characters/builder',
      name: 'characterBuilder',
      component: CharacterCreate,
      meta: {
        requiresAuth: true,
        new: true,
      },
    },

    {
      path: '/characters/builder/:characterId',
      name: 'characterCreate',
      component: CharacterCreate,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/encounters',
      name: 'encounters',
      component: Encounters,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/encounters/:encounterId',
      name: 'encounterDetails',
      component: EncounterDetails,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    {
      path: '/register',
      name: 'register',
      component: Register,
    },
  ],
});

router.beforeEach((to: Route, from: Route, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn()) {
    next({ name: 'login', query: { redirect: to.name as string } });
  } else if (isLoggedIn() && ['login', 'register'].includes(to.name as string)) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
