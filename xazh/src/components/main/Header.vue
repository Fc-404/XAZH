<template>
  <div :id="stylePageInfo.style.value">
    <a-progress
      v-show="store.getters['header/onProgress']"
      id="header-progress"
      :percent="store.getters['header/progress']"
      :showInfo="false"
      stroke-color="var(--colorPrimary)"
      trail-color="transparent"
      :size="3"
    ></a-progress>
    <div id="header-container">
      <div id="header-box">
        <div style="width: 4rem;"></div>
        <div id="header-logo">
          <Logo
            id="header-logo-"
            size="3rem"
            color="var(--colorPrimary)"
          ></Logo>
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
        <div>
          <a-divider type="vertical" />
        </div>
        <div>
          <a-button
            ghost
            type="primary"
          >
            <search-outlined />
          </a-button>
        </div>
        <div>
          <a-switch
            id="header-ondark"
            v-model:checked="onDark"
            checked-children="日"
            un-checked-children="夜"
          ></a-switch>
        </div>
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
        <div style="margin-left: 1rem;">
          <a-popover
            content="Meajifejaiojsfioajefiasjifjeiofjaisoefjsioe"
            placement="bottomRight"
          >
            <!-- <a-button>个人</a-button> -->
          </a-popover>
        </div>
        <div style="width: 2rem;"></div>
      </div>
      <div id="title-box">
        <p id="title-box-">{{ store.getters['header/title'] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import switchStyle from '../../tools/switchStyle.tool.ts'
import { ModeTitlePageI, StylePageI } from '../../interface/page.i.ts'

import { SearchOutlined } from '@ant-design/icons-vue';

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
  const hs: JQuery<HTMLElement> = $('#header-box > #header-slider')
  const blog: JQuery<HTMLElement> = $('#header-box > #header-blog')
  const items: JQuery<HTMLElement> = $('#header-box > .header-item')
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

/**
 * On dark
 */
const onDark = ref<boolean>(false)
const onDarkFn = inject('onDark')
watch(onDark, () => {
  (onDarkFn as Function)(onDark.value)
})
watch(computed(() => {
  return store.getters['config/ondark']
}), (v) => {
  onDark.value = v
})

/**
 * Title Hook
 */
const titleDeal = function () {
  const headerContainer: JQuery<HTMLElement> = $('#header-container')
  var scrollTopForTitle: number = 0
  var changeTitleDebounceHandle: any

  const dealCore = () => {
    clearTimeout(changeTitleDebounceHandle)
    changeTitleDebounceHandle = setTimeout(() => {
      if (store.getters['header/title'] === null)
        return

      if (store.getters['header/titleMode'] == ModeTitlePageI.SCROLL) {
        var scrollTopForTitleT = document.documentElement.scrollTop
        if (scrollTopForTitleT > scrollTopForTitle) {
          headerContainer.css('top', 'calc(var(--headerHeight) * -1)')
        } else {
          headerContainer.css('top', '0')
        }
        scrollTopForTitle = scrollTopForTitleT
      } else if (store.getters['header/titleMode'] == ModeTitlePageI.CONSTANT) {
        headerContainer.css('top', 'calc(var(--headerHeight) * -1)')
      }
    }, 44)
  }
  dealCore()

  const preBarTitle = document.title

  store.commit('header/changeTitleHandle', (v: string) => {
    console.log(document.title);
    document.title = v
  })

  store.commit('header/closeTitleHandle', () => {
    headerContainer.css('top', '0')
    document.title = preBarTitle
  })

  window.addEventListener('scroll', () => {
    dealCore()
  })
}

/**
 * HOOK
 */
onBeforeMount(() => {
  switchStyle(stylePageInfo)
})

onMounted(() => {
  if (store.getters["config/isPlatform"]('Desktop'))
    initSlider()
  titleDeal()
})

</script>

<style scoped lang="less">
#header {
  height: var(--headerHeight);
  width: 100%;
  min-width: 1024px;
  position: relative;
  overflow: hidden;

  &-progress {
    position: absolute;
    top: 0;
    line-height: 0;
  }

  &-container {
    height: 200%;
    width: 100%;
    position: absolute;
    transition: all .2s ease-in-out;

    #header-box {
      width: 100%;
      height: var(--headerHeight);
      display: flex;
      position: relative;

      #header-logo {
        height: 100%;

        &- {
          margin-top: 0.5rem;
        }

        >label {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 3rem;
          display: inline-block;
          vertical-align: top;
          margin: 0.5rem 2rem auto 3rem;
          // background-image:
          //   linear-gradient(45deg, var(--colorPrimary) 30%,
          //     var(--colorBgLayout));
          // background-clip: text;
          // -webkit-background-clip: text;
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          color: var(--colorPrimary);
        }
      }

      .header-item {
        color: var(--colorTextBase);
        user-select: none;
        padding-right: 1.1rem;
        padding-left: 1.1rem;
        cursor: pointer;
        transition: all 200ms ease-in-out;
      }

      #header-slider {
        position: absolute;
        height: 4px;
        border-radius: 2px;
        background-color: var(--colorPrimary);
        bottom: 0;
        transition: all 400ms ease-in-out;
      }

      #header-ondark {
        margin-right: 1rem;
        margin-left: 1rem;
        margin-bottom: 0.2rem;
      }
    }

    #title-box {
      width: 100%;
      height: var(--headerHeight);
      display: flex;
      position: relative;
      justify-content: center;

      &- {
        line-height: var(--headerHeight);
        font-size: 1.6rem;
        font-weight: bold;
        color: var(--colorPrimary);
      }
    }
  }
}

#header-m {

  background-color: red;
}
</style>