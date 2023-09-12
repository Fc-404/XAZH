<!-- Configure Cookie -->

<script setup lang="ts">
import { useStore } from 'vuex'
import cookie from 'js-cookie'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { onBeforeMount } from 'vue';
import { Md5 } from 'ts-md5';

const store = useStore()

/**
 * Signin test with token
 */
const testTokenValidity = function () {
  const token = cookie.get('token') || null
  if (!token) {
    message.info('Not signin token.')
    // TODO
    return
  }

  // test token
  axios.post('/VerifyToken', {
    token: Md5.hashStr(token)
  })
    .then(() => {
      store.commit('signin/isSignin', true)
    })
    .catch(() => {

    })
    .finally(() => {

    })
}

/**
 * HOOK
 */
onBeforeMount(() => {
  testTokenValidity()
})
</script>
<template>
  <div>

  </div>
</template>

<style scoped></style>