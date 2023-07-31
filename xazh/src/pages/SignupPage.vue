<template>
  <div>
    <h1>{{ route.query?.type }}</h1>
  </div>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";

const route = useRoute()

</script>

<style scoped>

</style>