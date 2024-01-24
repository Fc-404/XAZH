import { RouteRecordRaw, Router, createRouter, createWebHistory } from "vue-router"

const SignupPage = () => import('../pages/func/SignupPage.vue')
const BlogEdit = () => import('../pages/func/EditBlog.vue')

const Main = () => import('../pages/main/Main.vue')
const Blogs = () => import('../pages/main/Blogs.vue')
const Projects = () => import('../pages/main/Projects.vue')
const Tools = () => import('../pages/main/Tools.vue')
const Favors = () => import('../pages/main/Favors.vue')
const XAZH = () => import('../pages/main/XAZH.vue')
// Panel
import WEBPanel from './webpanel'
const AdminPanel = () => import('../pages/panel/AdminPanel.vue')

const routes: RouteRecordRaw[] = [
  {
    name: 'Signup',
    path: '/signup',
    component: SignupPage,
  },
  {
    name: 'BlogEdit',
    path: '/blogs/edit',
    component: BlogEdit
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
      // Panel
      WEBPanel,
      {
        name: 'AdminPanel',
        path: 'panel/admin',
        component: AdminPanel
      }
    ]
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => {
    return { top: 0 }
  }
})

export default router