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
    <div id="header-blog" class="header-item">博客
    </div>
    <div class="header-item">项目</div>
    <div class="header-item">工具</div>
    <div class="header-item">推荐</div>
    <div class="header-item">夏至</div>
    <div id="header-slider"></div>
    <div id="header-self">
      <router-link to="/signup?type=signup">
        <el-button id="header-signup">注册</el-button>
      </router-link>
      <div style="width: 1rem; display: inline-block"></div>
      <router-link to="/signup?type=signin">
        <el-button id="header-signin" type="primary">登录</el-button>
      </router-link>
    </div>
    <div style="width: 2rem;"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
// import $ from 'jQuery'

// Set the slider
const initSlider = function () {
  // init
  const hs: JQuery<HTMLElement> = $('#header-slider')
  const blog: JQuery<HTMLElement> = $('#header-blog')
  const items: JQuery<HTMLElement> = $('.header-item')
  let index: JQuery<HTMLElement> = blog

  hs.css('left', blog.offset()?.left ?? 0)
    .css('width', blog.outerWidth() ?? 0)
  index.css('color', 'var(--el-color-primary')

  // event
  items.on('mouseenter', function () {
    hs.css('left', $(this).offset()?.left ?? 0)
      .css('width', $(this).outerWidth() ?? 0)
  }).on('mouseleave', function () {
    hs.css('left', index.offset()?.left ?? 0)
      .css('width', index.outerWidth() ?? 0)
  }).on('click', function () {
    index.css('color', 'var(--el-text-color-primary)')
    index = $(this)
    index.css('color', 'var(--el-color-primary)')
  })

  document.body.onresize = function () {
    hs.css('left', index.offset()?.left ?? 0)
  }
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
  background-image: linear-gradient(45deg, var(--color-primary) 30%, var(--el-color-primary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-item {
  color: var(--el-text-color-primary);
  line-height: 4rem;
  user-select: none;
  padding-right: 1.1rem;
  padding-left: 1.1rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

#header-slider {
  position: absolute;
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--el-color-primary);
  bottom: 0;
  transition: all 400ms ease-in-out;
}

#header-signin, #header-signup {
  height: 2rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}

#header-signin:hover, #header-signin:focus {
  background-color: var(--color-minor);
}
</style>