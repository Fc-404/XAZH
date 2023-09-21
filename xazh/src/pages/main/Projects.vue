<template>
  <div>
    Projects
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';

const store = useStore()


onMounted(() => {
  store.commit('header/onProgress', false)
})
onUnmounted(() => {
  store.commit('header/onProgress', true)
})
</script>

<style scoped></style>