import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

import SignupPage from '../pages/SignupPage.vue'
import Main from '../pages/Main.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Signup',
    path: '/signup',
    component: SignupPage,
  },
  {
    name: 'Main',
    path: '/',
    component: Main,
    // redirect: 'signin',
    children: [
      {
        name: 'MainSignin',
        path: 'signin',
        component: SignupPage
      }
    ]
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router