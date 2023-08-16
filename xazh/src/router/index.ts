import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

const SignupPage = () => import('../pages/SignupPage.vue')
const Main = () => import('../pages/Main.vue')
const Blogs = () => import('../pages/Blogs.vue')
const Projects = () => import('../pages/Projects.vue')
const Tools = () => import('../pages/Tools.vue')
const Favors = () => import('../pages/Favors.vue')
const XAZH = () => import('../pages/XAZH.vue')

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
    redirect: 'blogs',
    children: [
      {
        name: 'MainBlogs',
        path: 'blogs',
        component: Blogs
      },
      {
        name: 'MainProjects',
        path: 'projects',
        component: Projects
      },
      {
        name: 'MainTools',
        path: 'tools',
        component: Tools
      },
      {
        name: 'MainFavors',
        path: 'favors',
        component: Favors
      },
      {
        name: 'MainXAZH',
        path: 'xazh',
        component: XAZH
      },
    ]
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router