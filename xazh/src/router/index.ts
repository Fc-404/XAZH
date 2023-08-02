import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

const SignupPage = () => import('../pages/SignupPage.vue')
const Main = () => import('../pages/Main.vue')

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
      // {
      //   name: 'MainSignin',
      //   path: 'main/signin',
      //   component: null
      // }
    ]
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router