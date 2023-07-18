import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

import Signup from '../pages/Signup.vue'
import Main from '../pages/Main.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'signup',
    path: '/signup',
    component: Signup,
  },
  {
    name: 'main',
    path: '/',
    component: Main,
    // redirect: 'signin',
    children: [
      {
        name: 'main2signin',
        path: 'signin',
        component: Signup
      }
    ]
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router