import { RouteRecordSingleViewWithChildren } from 'vue-router'
import { GetUserInfoAPI } from '../api/base.user.api'

const WEBPanel = () => import('../pages/panel/WEBPanel.vue')
const test = () => import('../pages/panel/webpanel/test.vue')
const blogoptions = () => import('../pages/panel/webpanel/blogoptions.vue')
const push = () => import('../pages/panel/webpanel/push.vue')

const webpanel: RouteRecordSingleViewWithChildren = {
  name: 'WEBPanel',
  path: 'webpanel',
  component: WEBPanel,
  redirect: '/webpanel/performance',
  async beforeEnter(to, from, next) {
    to; from;
    await GetUserInfoAPI(true)
      .then(res => {
        if (res.body?.level >= 2)
          next()
        else
          next('/403')
      })
      .catch(() => {
        next('/403')
      })
  },

  children: [
    {
      name: 'WEBPanel/performance',
      path: 'performance',
      component: test
    },
    {
      name: 'WEBPanel/notice',
      path: 'push/:sub',
      component: push
    },
    {
      name: 'WEBPanel/mailbox',
      path: 'mailbox/:sub',
      component: test,
    },
    {
      name: 'WEBPanel/blogoptions',
      path: 'blogoptions/:sub',
      component: blogoptions
    },
    {
      name: 'WEBPanel/examination',
      path: 'examination',
      component: test
    },
    {
      name: 'WEBPanel/heatanalysis',
      path: 'heatanalysis',
      component: test
    }
  ],
}

export default webpanel