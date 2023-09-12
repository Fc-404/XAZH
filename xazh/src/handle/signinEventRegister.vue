<!-- Signin event register -->

<script setup lang="ts">
import { useStore } from 'vuex'
const store = useStore()

/**
 * 
 */

const test = function () {
  // TODO
  console.log('signin success');
}

store.commit('signined', () => {
  test()
})
// store.commit('logout', () => {})
</script>
<template>
  <div>
  </div>
</template>
<style scoped></style>