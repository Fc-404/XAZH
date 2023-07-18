<template>
  <div id="header">
    <div style="width: 4rem;"></div>
    <div id="header-logo">
      <img
        src="../assets/logo.svg"
        alt="LOGO"
      >
      <label>夏至De主页</label>
    </div>
    <div style="flex-grow: 1;"></div>
    <div class="header-item">博客</div>
    <div class="header-item">项目</div>
    <div class="header-item">工具</div>
    <div class="header-item">推荐</div>
    <div class="header-item">夏至</div>
    <div id="header-slider"></div>
    <div id="header-self">
      <el-button style="margin-top: 1rem">注册</el-button>
      <el-button style="margin-top: 1rem">登录</el-button>
    </div>
    <div style="width: 4rem;"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import * as $ from 'JQuery'

// Set the slider
const initSlider = function () {
  const hs = $('#header-slider')
  console.log(hs);
}

onMounted(
  () => {
    initSlider()
  }
)
</script>

<style scoped>
#header {
  height: 4rem;
  width: 100%;
  display: flex;
  position: relative;
  /* background-color: #f5f5f5; */
}

#header-logo {
  height: 100%;
}

#header-logo > img {
  height: 3rem;
  margin-top: 0.5rem;
}

#header-logo > label {
  font-size: 1.5rem;
  font-weight: bold;
  display: inline-block;
  vertical-align: bottom;
  margin: auto 2rem 0.6rem 3rem;
  background-image: linear-gradient(45deg, #6611ff 30%, var(--el-color-primary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-item {
  color: var(--el-text-color-primary);
  line-height: 4rem;
  user-select: none;
  padding-right: 2rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.header-item:hover {
  color: var(--el-color-primary);
}

#header-slider {
  position: absolute;
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--el-color-primary);
  bottom: 0;
}
</style>