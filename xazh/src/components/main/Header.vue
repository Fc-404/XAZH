<template>
  <div :id="stylePageInfo.style.value">
    <div class="header-box">
      <div style="width: 4rem;"></div>
      <div id="header-logo">
        <img
          src="../../assets/logo.svg"
          alt="LOGO"
        >
        <label>夏至De主页</label>
      </div>
      <div style="flex-grow: 1;"></div>
      <div
        id="header-blog"
        class="header-item"
      >博客
      </div>
      <div class="header-item">项目</div>
      <div class="header-item">工具</div>
      <div class="header-item">推荐</div>
      <div class="header-item">夏至</div>
      <div id="header-slider"></div>
      <div id="header-self">
        <router-link to="/signup?type=signup">
          <a-button id="header-signup">注册</a-button>
        </router-link>
        <div style="width: 1rem; display: inline-block"></div>
        <router-link to="/signup?type=signin">
          <a-button
            id="header-signin"
            type="primary"
          >登录
          </a-button>
        </router-link>
      </div>
      <div style="width: 2rem;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import switchStyle from '../../tools/switchStyle.tool.ts'
import { StylePageI } from '../../interface/page.i.ts'

const store = useStore()
const stylePageInfo: StylePageI = {
  name: 'header',
  style: ref<string>('Desktop')
}

/**
 * Set the slider.
 */
const initSlider = function () {
  // init
  const hs: JQuery<HTMLElement> = $('#header-slider')
  const blog: JQuery<HTMLElement> = $('#header-blog')
  const items: JQuery<HTMLElement> = $('.header-item')
  let index: JQuery<HTMLElement> = blog

  hs.css('left', blog.offset()?.left ?? 0)
    .css('width', blog.outerWidth() ?? 0)
  index.css('color', 'var(--colorPrimary')

  // event
  items.on('mouseenter', function () {
    hs.css('left', $(this).offset()?.left ?? 0)
      .css('width', $(this).outerWidth() ?? 0)
  }).on('mouseleave', function () {
    hs.css('left', index.offset()?.left ?? 0)
      .css('width', index.outerWidth() ?? 0)
  }).on('click', function () {
    index.css('color', 'var(--colorTextBase)')
    index = $(this)
    index.css('color', 'var(--colorPrimary)')
  })

  document.body.onresize = function () {
    hs.css('left', index.offset()?.left ?? 0)
  }
}

onBeforeMount(() => {
  switchStyle(stylePageInfo)
})

onMounted(() => {
  if (store.getters["config/isPlatform"]('Desktop'))
    initSlider()
})

</script>

<style scoped lang="less">
#header {
  height: 4rem;
  width: 100%;
  position: relative;

  .header-box {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }

  &-logo {
    height: 100%;

    img {
      height: 3rem;
      margin-top: 0.5rem;
    }

    label {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 3rem;
      display: inline-block;
      vertical-align: top;
      margin: 0.5rem 2rem auto 3rem;
      background-image: linear-gradient(45deg, var(--colorPrimaryTextActive) 30%, var(--colorPrimaryBg));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .header-item {
    color: var(--colorTextBase);
    line-height: 4rem;
    user-select: none;
    padding-right: 1.1rem;
    padding-left: 1.1rem;
    cursor: pointer;
    transition: all 200ms ease-in-out;
  }

  &-slider {
    position: absolute;
    height: 4px;
    border-radius: 2px;
    background-color: var(--colorPrimary);
    bottom: 0;
    transition: all 400ms ease-in-out;
  }

  &-signin,
  &-signup {
    height: 2rem;
    margin-top: 1rem;
    font-size: 0.8rem;
  }
}

#header-m {
  background-color: red;
}
</style>