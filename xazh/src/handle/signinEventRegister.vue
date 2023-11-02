<!-- Signin event register -->

<script setup lang="ts">
import axios from 'axios';
import { useStore } from 'vuex'
import { AxiosErrorCatch } from '../util/error.axios.tool';
const store = useStore()

const getUserInfo = function () {
  // const userInfo
  axios.post('/User/GetUserInfo', {
    ...store.getters['signin/requireParam']
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