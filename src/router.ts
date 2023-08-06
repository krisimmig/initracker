import Vue from 'vue';
import Router from 'vue-router';
import { Route } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import CharactersView from '@/views/CharactersView.vue';
import CharacterCreateView from '@/views/CharacterCreateView.vue';
import EncountersView from '@/views/EncountersView.vue';
import EncounterDetailsView from '@/views/EncounterDetailsView.vue';
import FeedbackView from '@/views/FeedbackView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import UserDetailsView from '@/views/UserDetailsView.vue';
import { isLoggedIn } from '@/store/firebase';

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
      component: HomeView,
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/user',
      name: 'userdetails',
      component: UserDetailsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/characters',
      name: 'characters',
      component: CharactersView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/characters/edit/:uuid',
      name: 'editCharacter',
      component: CharacterCreateView,
      meta: {
        requiresAuth: true,
        edit: true,
      },
    },

    {
      path: '/characters/builder',
      name: 'characterBuilder',
      component: CharacterCreateView,
      meta: {
        requiresAuth: true,
        new: true,
      },
    },

    {
      path: '/characters/builder/:characterId',
      name: 'characterCreate',
      component: CharacterCreateView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/encounters',
      name: 'encounters',
      component: EncountersView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/encounters/:encounterId',
      name: 'encounterDetails',
      component: EncounterDetailsView,
      meta: {
        requiresAuth: true,
        isFullWidth: true,
      },
    },

    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
});

router.beforeEach((to: Route, from: Route, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn()) {
    next({name: 'login', query: {redirect: to.name as string}});
  } else if (isLoggedIn() && ['login', 'register'].includes(to.name as string)) {
    next({name: 'home'});
  } else {
    next();
  }
});

export default router;
