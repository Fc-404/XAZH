<template>
  <div id="signupage">
    <Signup
      id="signup"
      :type="$route.query.type?.toString()"
      @signin-success="signinSuccess"
    ></Signup>
  </div>
</template>

<script setup lang="ts">

import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()

document.title = '夏至De主页 ' + route.query?.type

const signinSuccess = function () {
  // router.push({
  //   path: '/'
  // })
  router.back()
}

</script>

<style scoped>
#signupage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#signup {
  margin-bottom: 9rem;
}
</style>