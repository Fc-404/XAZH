<!-- Configure Cookie -->

<script setup lang="ts">
import { useStore } from 'vuex'
import cookie from 'js-cookie'
import axios from 'axios'
import { message } from 'ant-design-vue'

import { base64WithDate } from '../tools/encodeMsg.tool'

const store = useStore()

/**
 * Signin test with token
 */
const testTokenValidity = function () {
  const user = cookie.get('user') || null
  const token = cookie.get('token') || null
  if (!token || !user) {
    message.info('Not signin token.')
    store.commit('signin/isSignin', false)
    // TODO
    return
  }

  const param = base64WithDate(token)

  // test token
  axios.post('/User/VerifyToken', {
    date: param.date,
    user: user,
    token: param.data
  })
    .then((r) => {
      if (r.data.code == 0) {
        store.commit('signin/isSignin', true)
        store.commit('signin/signinToken', token)
      } else {
        message.warn('登录失效！')
        store.commit('signin/isSignin', false)
      }
    })
    .catch(() => {
      message.error('服务器错误！')
    })
}

/**
 * HOOK
 */
onMounted(() => {
  testTokenValidity()
})
</script>
<template>
  <div>

  </div>
</template>

<style scoped></style>