<template>
  <div id="NotFound">
    <Lottie path="/public/lottie/404.json"></Lottie>
    <p>Not Found<br>页面没找到</p>
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