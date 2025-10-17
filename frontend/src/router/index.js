import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MatchCaseView from '@/views/MatchCaseView.vue'
import ReviewView from '@/views/ReviewView.vue'
import ShowResultsView from '@/views/ShowResultsView.vue'
import AllSubjectsView from '@/views/AllSubjectsView.vue'
import ReviewSubjectsView from '@/views/ReviewSubjectsView.vue'
import PopularSubjectsView from '@/views/PopularSubjectsView.vue'
import Login from '@/views/Login.vue'
import SignupView from '@/views/Signup.vue'
import FavoritesView from '@/views/FavoritesView.vue'

import test from '@/layout/test.vue'


const router = createRouter({
  history:createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/matchcase',
      name: 'matchcase',
      component: MatchCaseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
      meta: { requiresAuth: true }
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
      path: '/subjects/:id/reviews',
      name: 'reviewsubjects',
      component: ReviewSubjectsView,
    },
    {
      path: '/popularsubjects',
      name: 'popularsubjects',
      component: PopularSubjectsView,
    },
    { path: '/login', 
      name: 'login', 
      component: Login 
    },
    { path: '/signup', 
      name: 'signup', 
      component: SignupView 
    },

    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/test', 
      name: 'test', 
      component: test 
    }
  

  ],
})


// แทน router.beforeEach ปัจจุบัน
router.beforeEach(async (to, from, next) => {
  // ถ้า route ไม่ต้องล็อกอินก็ผ่าน
  if (!to.meta?.requiresAuth) return next();

  try {
    const API = import.meta.env.VITE_API_URL || '';
    // เรียก /me บน backend เพื่อเช็ค session cookie
    const res = await fetch(`${API}/me`, { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      return next({ name: 'login' });
    }
    // ถ้าต้องการข้อมูล user เก็บไว้ใน store ที่นี่ (Pinia) — แต่ถ้ายังไม่ใช้ store ก็แค่ allow
    // const data = await res.json();
    return next();
  } catch (e) {
    return next({ name: 'login' });
  }
});


export default router
