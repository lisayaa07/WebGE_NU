import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MatchCaseView from '@/views/MatchCaseView.vue'
import ReviewView from '@/views/ReviewView.vue'
import ShowResultsView from '@/views/ShowResultsView.vue'
import AllSubjectsView from '@/views/AllSubjectsView.vue'
import ReviewSubjectsView from '@/views/ReviewSubjectsView.vue'
import PopularSubjectsView from '@/views/PopularSubjectsView.vue'
import Login from '@/views/Login.vue'
import SignupView from '@/views/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/matchcase',
      name: 'matchcase',
      component: MatchCaseView,
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
    },
    {
      path: '/showresults',
      name: 'showresults',
      component: ShowResultsView,
    },
    {
      path: '/allsubjects',
      name: 'allsubjects',
      component: AllSubjectsView,
    },
    {
      path: '/reviewsubjects',
      name: 'reviewsubjects',
      component: ReviewSubjectsView,
    },
    {
      path: '/popularsubjects',
      name: 'popularsubjects',
      component: PopularSubjectsView,
    },
    { path: '/login', name: 'login', component: Login },
    { path: '/signup', name: 'signup', component: SignupView },


    { path: '/Login.vue', redirect: '/login' },
    { path: '/Login', redirect: '/login' },

    // หน้าที่ต้องล็อกอิน
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/matchcase', name: 'matchcase', component: MatchCaseView, meta: { requiresAuth: true } },
    { path: '/review', name: 'review', component: ReviewView, meta: { requiresAuth: true } },
  ],
})


// guard ง่าย ๆ
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('auth') === '1'
  if (to.meta.requiresAuth && !loggedIn) return next({ name: 'login' })
  next()
})

export default router
