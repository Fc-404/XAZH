import {
  RouteRecordRaw,
  Router,
  createRouter,
  createWebHistory,
} from 'vue-router'

const SignupPage = () => import('../pages/func/SignupPage.vue')
const BlogEdit = () => import('../pages/func/EditBlog.vue')
const Main = () => import('../pages/main/Main.vue')

// Panel
import Error from './error'
import Menu from './menu'
import Other from './other'
import WEBPanel from './webpanel'

const BlogShow = () => import('../pages/func/ShowBlog.vue')

const AdminPanel = () => import('../pages/panel/AdminPanel.vue')

const routes: RouteRecordRaw[] = [
  // {
  //   name: 'BlogShow',
  //   path: '/b/:bid',
  //   component: BlogShow,
  // },
  {
    name: 'Signup',
    path: '/signup',
    component: SignupPage,
  },
  {
    name: 'BlogEdit',
    path: '/blogs/edit',
    component: BlogEdit,
  },
  {
    name: 'Main',
    path: '/',
    component: Main,
    redirect: 'blogs',
    children: [
      ...Error,
      ...Menu,
      ...Other,
      // Panel
      WEBPanel,
      {
        name: 'AdminPanel',
        path: 'panel/admin',
        component: AdminPanel,
      },
    ],
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => {
    return { top: 0 }
  },
})

export default router
