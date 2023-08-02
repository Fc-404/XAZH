<template>
  <div id="main">
    <a-layout>
      <a-layout-header id="main-header">
        <Header></Header>
      </a-layout-header>
      <a-layout-content id="main-">
        <div></div>
      </a-layout-content>
      <a-layout-footer id="main-footer">
        <Footer></Footer>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
#main {
  #main-header {
    padding: 0;
    height: auto;
    background-color: transparent;
  }

  #main- {
    height: 50rem;
    // background-color: red;
  }
}
</style>