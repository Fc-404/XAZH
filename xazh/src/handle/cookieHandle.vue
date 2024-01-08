<!-- Configure Cookie -->

<script setup lang="ts">
import { useStore } from 'vuex'
import cookie from 'js-cookie'
import { message } from 'ant-design-vue'

import { base64WithDate } from '../util/encodeMsg.tool'
import { VerifyTokenAPI } from '../api/base.user.api'

const store = useStore()

/**
 * Signin test useing the token in cookie
 */
const testTokenValidity = async function () {
  const id = cookie.get('id') || null
  const user = cookie.get('user') || null
  const token = cookie.get('token') || null
  if (!token || !user || !id) {
    message.info('Not signin token.')
    store.commit('signin/logout')
    // TODO
    return
  }

  const param = base64WithDate(token)

  await VerifyTokenAPI({
    id: id, token: param.data, date: param.date
  })
    .then(r => {
      if (r) {
        store.commit('signin/signin', {
          id: id, token: token
        })
      } else {
        message.warn('登录失效！')
        store.commit('signin/logout')
      }
    })
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
</template>../assets/error.axios.tool