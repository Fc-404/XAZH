import { RouteRecordSingleView } from 'vue-router'

const Blogs = () => import('../pages/main/Blogs.vue')
const Projects = () => import('../pages/main/Projects.vue')
const Tools = () => import('../pages/main/Tools.vue')
const Favors = () => import('../pages/main/Favors.vue')
const XAZH = () => import('../pages/main/XAZH.vue')

const menu: Array<RouteRecordSingleView> = [
  {
    name: 'MainBlogs',
    path: 'blogs',
    component: Blogs,
  },
  {
    name: 'MainProjects',
    path: 'projects',
    component: Projects,
  },
  {
    name: 'MainTools',
    path: 'tools',
    component: Tools,
  },
  {
    name: 'MainFavors',
    path: 'favors',
    component: Favors,
  },
  {
    name: 'MainXAZH',
    path: 'xazh',
    component: XAZH,
  },
]

export default menu