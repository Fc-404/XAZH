<script setup lang="ts">
import { useRouter } from 'vue-router';

useRouter().replace({
  name: 'main'
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
