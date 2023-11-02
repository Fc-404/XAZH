<template>
  <div id="header">
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

        <!-- LOGO -->
        <div id="header-logo">
          <Logo
            id="header-logo-"
            size="3rem"
            color="var(--colorPrimary)"
          ></Logo>
          <label>夏至De主页</label>
        </div>
        <div style="flex-grow: 1;"></div>

        <!-- Menu -->
        <div
          id="header-blog"
          class="header-item"
          @click="toMenu('MainBlogs')"
        >博客
        </div>
        <div
          id="header-project"
          class="header-item"
          @click="toMenu('MainProjects')"
        >项目</div>
        <div
          id="header-tool"
          class="header-item"
          @click="toMenu('MainTools')"
        >工具</div>
        <div
          id="header-favor"
          class="header-item"
          @click="toMenu('MainFavors')"
        >推荐</div>
        <div
          id="header-xazh"
          class="header-item"
          @click="toMenu('MainXAZH')"
        >夏至</div>
        <div id="header-slider"></div>

        <div>
          <a-divider type="vertical" />
        </div>
        <!-- Search -->
        <div>
          <a-popover placement="bottomRight">
            <template #content>
              <FnNotice :size="2"></FnNotice>
            </template>
            <a-button
              ghost
              type="primary"
            >
              <search-outlined />
            </a-button>
          </a-popover>
        </div>

        <!-- onDark -->
        <div>
          <a-switch
            id="header-ondark"
            v-model:checked="onDark"
            checked-children="日"
            un-checked-children="夜"
          ></a-switch>
        </div>

        <!-- Signup -->
        <div
          id="header-self"
          v-if="!isSignin"
        >
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

        <!-- Self -->
        <div v-if="isSignin">
          <SelfPanel></SelfPanel>
        </div>
        <div style="width: 2rem;"></div>
      </div>
      <div id="title-box">
        <!-- Title -->
        <p id="title-box-">{{ store.getters['header/title'] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { ModeTitlePageI } from '../../interface/page.i.ts'

import { SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const store = useStore()


/**
 * To Menu
 */
const router = useRouter()
const toMenu = function (name: string) {
  router.push({
    name: name
  })
}

/**
 * Set the slider.
 */
const initSlider = function () {
  const hs = document.querySelector('#header-box > #header-slider') as HTMLElement
  const blog = document.querySelector('#header-box > #header-blog') as HTMLElement
  const project = document.querySelector('#header-box > #header-project') as HTMLElement
  const tool = document.querySelector('#header-box > #header-tool') as HTMLElement
  const favor = document.querySelector('#header-box > #header-favor') as HTMLElement
  const xazh = document.querySelector('#header-box > #header-xazh') as HTMLElement
  const items = document.querySelectorAll('#header-box > .header-item') as NodeListOf<HTMLElement>

  let initFunc = blog
  const funcName = router.currentRoute.value.path.split('/')[1]
  switch (funcName) {
    case 'projects':
      initFunc = project
      break
    case 'tools':
      initFunc = tool
      break
    case 'favors':
      initFunc = favor
      break
    case 'xazh':
      initFunc = xazh
      break
  }
  let index: HTMLElement = initFunc

  hs.style.left = initFunc.offsetLeft + 'px'
  hs.style.width = initFunc.offsetWidth + 'px'
  index.style.color = 'var(--colorPrimary)'

  // event
  items.forEach((v) => {
    v.onmouseenter = () => {
      hs.style.left = v.offsetLeft + 'px'
      hs.style.width = v.offsetWidth + 'px'
    }
    v.onmouseleave = () => {
      hs.style.left = index.offsetLeft + 'px'
      hs.style.width = index.offsetWidth + 'px'
    }
    v.onclick = () => {
      index.style.color = 'var(--colorTextBase)'
      index = v
      index.style.color = 'var(--colorPrimary)'
    }
  })

  store.commit('addResizeEvent', {
    name: 'headerSliderAdjust',
    fn: () => {
      hs.style.left = index.offsetLeft + 'px'
      hs.style.width = index.offsetWidth + 'px'
    }
  })
}

/**
 * TODO: Progress
 */
window.addEventListener('scroll', () => {
  if (!store.getters['header/onProgress'])
    return
  let progressOld = -1
  let progress = Math.round(
    (document.documentElement.scrollTop * 100) /
    (document.documentElement.scrollHeight - window.innerHeight))

  if (progressOld != progress) {
    store.commit('header/progress', progress)
    progressOld = progress
  }
})

/**
 * On dark
 */
const onDark = ref<boolean>(store.getters['config/ondark'])
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
  const headerContainer: HTMLElement = document.getElementById('header-container') as HTMLElement
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
          headerContainer.style.top = 'calc(var(--headerHeight) * -1)'
        } else {
          headerContainer.style.top = '0'
        }
        scrollTopForTitle = scrollTopForTitleT
      } else if (store.getters['header/titleMode'] == ModeTitlePageI.CONSTANT) {
        headerContainer.style.top = 'calc(var(--headerHeight) * -1)'
      }
    }, 44)
  }
  dealCore()

  const preBarTitle = document.title

  store.commit('header/changeTitleHandle', (v: string) => {
    document.title = v
  })

  store.commit('header/closeTitleHandle', () => {
    headerContainer.style.top = '0'
    document.title = preBarTitle
  })

  window.addEventListener('scroll', () => {
    dealCore()
  })
}

/**
 * Self Panel
 */
const isSignin = ref<boolean>(store.getters['signin/on'])
watch(computed(() => {
  return store.getters['signin/on']
}), (v) => {
  isSignin.value = v
})


/**
 * HOOK
 */
onMounted(() => {
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
          margin: 0.5rem 2rem auto 2rem;
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
</style>