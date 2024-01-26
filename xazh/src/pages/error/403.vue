<template>
  <div id="NotFound">
    <Lottie path="/public/lottie/403.json"></Lottie>
    <p>Forbidden<br>您没有权限访问</p>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
#NotFound {
  width: 70%;
  margin: 10vh auto 0 auto;

  p {
    font-size: 3rem;
    font-weight: bolder;
    text-align: center;
    color: var(--colorTextTertiary);
  }
}
</style>