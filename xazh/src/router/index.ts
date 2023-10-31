import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

const SignupPage = () => import('../pages/func/SignupPage.vue')
const Main = () => import('../pages/main/Main.vue')
const Blogs = () => import('../pages/main/Blogs.vue')
const Projects = () => import('../pages/main/Projects.vue')
const Tools = () => import('../pages/main/Tools.vue')
const Favors = () => import('../pages/main/Favors.vue')
const XAZH = () => import('../pages/main/XAZH.vue')

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
        path: 'tools/:name',
        component: Tools,
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
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router