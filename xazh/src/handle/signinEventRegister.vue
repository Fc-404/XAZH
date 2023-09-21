<!-- Signin event register -->

<script setup lang="ts">
import axios from 'axios';
import { useStore } from 'vuex'
import { base64WithDate } from '../util/encodeMsg.tool';
import { AxiosErrorCatch } from '../util/error.axios.tool';
const store = useStore()

const getUserInfo = function () {
  // TODO
  const tokenObj = base64WithDate(store.getters['signin/token'])
  // const userInfo
  axios.post('/User/GetUserInfo', {
    date: tokenObj.date,
    token: tokenObj.data,
    user: store.getters['signin/user']
  })
    .then((r) => {
      store.commit('signin/info', r.data.body)
    })
    .catch(AxiosErrorCatch)
}

onMounted(() => {
  store.commit('signin/setSignined', () => {
    getUserInfo()
  })
  // store.commit('logout', () => {})
})
</script>
<template>
  <div>
  </div>
</template>
<style scoped></style>../util/encodeMsg.tool../util/error.axios.tool