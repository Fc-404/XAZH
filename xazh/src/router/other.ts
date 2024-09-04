import {
  RouteRecordSingleView,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'

const BlogShow = () => import('../pages/func/ShowBlog.vue')
const SelfHome = () => import('../pages/func/SelfHome.vue')

const other: Array<RouteRecordSingleView | RouteRecordSingleViewWithChildren> =
  [
    {
      name: 'BlogShow',
      path: 'b/:bid',
      component: BlogShow,
    },
    {
      name: 'SelfHome',
      path: 'u/:uid',
      component: SelfHome,
      children: [
        {
          name: 'SelfHomeWithPos',
          path: ':pos',
          component: SelfHome,
        },
      ],
    },
  ]

export default other
