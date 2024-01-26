import { RouteRecordSingleView } from "vue-router"

const NotFound = () => import('../pages/error/404.vue')
const Forbidden = () => import('../pages/error/403.vue')


const error: Array<RouteRecordSingleView> = [
  {
    name: '404',
    path: ':catchAll(.*)',
    component: NotFound,
  },
  {
    name: '403',
    path: '403',
    component: Forbidden,
  }
]

export default error