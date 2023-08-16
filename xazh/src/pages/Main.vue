<template>
  <div id="main">
    <a-layout>
      <a-affix>
        <a-layout-header id="main-header">
          <Header></Header>
        </a-layout-header>
      </a-affix>
      <a-layout-content id="main-">
        <RouterView style="height: 1000px;"></RouterView>
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
    background-color: var(--colorBgLayout);
  }

  #main- {

    // background-color: red;
    >div {
      margin: auto 10vw;
    }
  }
}
</style>