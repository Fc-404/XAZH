<!-- Configure Cookie -->

<script setup lang="ts">
import { useStore } from 'vuex'
import cookie from 'js-cookie'
import axios from 'axios'
import { message } from 'ant-design-vue'

import { base64WithDate } from '../util/encodeMsg.tool'
import { AxiosErrorCatch } from '../util/error.axios.tool'

const store = useStore()

/**
 * Signin test with token
 */
const testTokenValidity = async function () {
  const user = cookie.get('user') || null
  const token = cookie.get('token') || null
  if (!token || !user) {
    message.info('Not signin token.')
    store.commit('signin/logout')
    // TODO
    return
  }

  const param = base64WithDate(token)

  // test token
  await axios.post('/User/VerifyToken', {
    date: param.date,
    user: user,
    token: param.data
  })
    .then((r) => {
      if (r.data.code == 0) {
        store.commit('signin/signin', token)
      } else {
        message.warn('登录失效！')
        store.commit('signin/logout')
      }
    })
    .catch(AxiosErrorCatch)
}

/**
 * HOOK
 */
onMounted(async () => {
  await testTokenValidity()
})
</script>
<template>
  <div></div>
</template>