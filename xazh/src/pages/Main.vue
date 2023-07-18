<template>
  <div>
    <ElContainer>
      <ElHeader id="header">
        <ElMenu
          id="header-"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
        >
          <div style="width: 64px"></div>
          <div id="header-logo">
            <img
              src="../assets/logo.svg"
              alt="LOGO"
            >
            <label>夏至De主页</label>
          </div>
          <div style="flex-grow: 1;"></div>
          <ElMenuItem index="1">博客</ElMenuItem>
          <ElMenuItem index="2">项目</ElMenuItem>
          <ElMenuItem index="3">工具</ElMenuItem>
          <ElMenuItem index="4">推荐</ElMenuItem>
          <ElMenuItem index="5">夏至</ElMenuItem>
          <div>
            <!-- <router-link to="/signup"> -->
            <ElButton style="margin-top: 12px">注册</ElButton>
            <ElButton style="margin-top: 12px">登录</ElButton>
            <!-- </router-link> -->
          </div>
          <div style="width: 64px"></div>
        </ElMenu>
      </ElHeader>
      <Header></Header>
    </ElContainer>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElContainer, ElHeader, ElMenu, ElMenuItem } from 'element-plus';
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
}
</script>

<style scoped>
#header {
  padding: 0;
}

#header- {
  height: 100%;
  position: relative;
  /* border: none; */
}

#header-logo {
  height: 100%;
}

#header-logo>img {
  height: 50px;
  margin-top: 5px;
}

#header-logo>label {
  font-size: 22px;
  font-weight: bold;
  display: inline-block;
  vertical-align: bottom;
  margin: auto 44px 12px 44px;
  background-image: linear-gradient(45deg, #6611ff 30%, #409eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>