<template>
  <div id="main">
    <el-container>
      <el-header id="main-header">
        <Header></Header>
      </el-header>
      <el-main id="main-">
        <div></div>
      </el-main>
      <el-footer id="main-footer">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElContainer, ElHeader } from 'element-plus';
</script>

<style scoped lang="scss">
#main {
  #main-header {
    padding: 0;
    height: auto;
  }

  #main- {
    height: 50rem;
    /*background-color: red;*/
  }
}
</style>