<template>
  <div>
    <Signup></Signup>
  </div>
</template>

<script setup lang="ts">

import { useRoute } from "vue-router";

const route = useRoute()

document.title = '夏至De主页 ' + route.query?.type

</script>

<style scoped></style>