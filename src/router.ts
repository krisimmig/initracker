import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import CharactersView from '@/views/CharactersView.vue'
import CharacterEdit from '@/views/CharacterEdit.vue'
import EncountersView from '@/views/EncountersView.vue'
import EncounterDetailsView from '@/views/EncounterDetailsView.vue'
import FeedbackView from '@/views/FeedbackView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserDetailsView from '@/views/UserDetailsView.vue'
import { isLoggedIn, authReady } from '@/store/firebase'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: '/user',
    name: 'userdetails',
    component: UserDetailsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/characters',
    name: 'characters',
    component: CharactersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/characters/edit/:type/:uuid?',
    name: 'characterEdit',
    component: CharacterEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/encounters',
    name: 'encounters',
    component: EncountersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/encounters/:encounterId',
    name: 'encounterDetails',
    component: EncounterDetailsView,
    meta: { requiresAuth: true, isFullWidth: true },
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: FeedbackView,
    meta: { requiresAuth: true },
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/DemoEncounterView.vue'),
    meta: { requiresAuth: false, isFullWidth: true },
  },
  {
    path: '/demo/character/:type/:uuid?',
    name: 'demoCharacterEdit',
    component: () => import('@/views/DemoCharacterEdit.vue'),
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: '/play/:shareId',
    name: 'player-view',
    component: () => import('@/views/PlayerView.vue'),
    meta: { requiresAuth: false, isFullWidth: true, hideAppBar: true },
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: 'is-activeExact',
  linkActiveClass: 'is-active',
  routes,
})

router.beforeEach(async (to, from, next) => {
  await authReady
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isLoggedIn()) {
    next({ name: 'login', query: { redirect: to.name as string } })
  } else if (isLoggedIn() && ['login', 'register'].includes(to.name as string)) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
