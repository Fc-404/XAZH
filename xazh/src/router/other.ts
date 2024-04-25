import { RouteRecordSingleView } from 'vue-router'

const BlogShow = () => import('../pages/func/ShowBlog.vue')

const other: Array<RouteRecordSingleView> = [
  {
    name: 'BlogShow',
    path: 'b/:bid',
    component: BlogShow,
  },
]

export default other
