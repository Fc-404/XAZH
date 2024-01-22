<script setup lang="ts">
import { useStore } from 'vuex'
import { theme } from 'ant-design-vue'
import { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { GlobalToken } from 'ant-design-vue/es/theme'
import axios from 'axios'
import cookie from 'js-cookie'
import { setXazhAxios } from './axios/xazh.axios'

import SigninEventRegister from './handle/signinEventRegister.vue'
import CookieHandle from './handle/cookieHandle.vue'
import { AxiosErrorCatch } from './axios/error.axios'

// import Modal from 'ant-design-vue/es/modal/Modal'

const store = useStore()

/**
 * Set backend's base api for axios.
 */
axios.interceptors.response.use(response => response,
  error => {
    AxiosErrorCatch(error)
    return Promise.reject(error)
  })
setXazhAxios({ baseURL: store.getters['config/baseApi'] })

/**
 * Switch what style of display in the light of
 * change of window width and user's selection.
 */
const toMobile = function () {
  if (window.outerWidth <= 1024) {
    store.commit('config/platform', 'Mobile')

    // let countDown = 3
    // const tip = Modal.warning({
    //   title: '已跳转到桌面端',
    //   content: h('div', [
    //     h('p', '移动端界面正在开发中...'),
    //     h('p', '暂请使用桌面端')
    //   ]),
    //   okText: '3s, 关闭',
    //   style: {
    //     marginLeft: '12px'
    //   }
    // })

    // const tipTimer = setInterval(() => {
    //   tip.update({
    //     okText: `${--countDown}s, 关闭`
    //   })
    // }, 1000)

    // setTimeout(() => {
    //   clearInterval(tipTimer)
    //   tip.destroy()
    // }, 3000)
  }
}
// Jump to mobile if the screen less than 1024px
toMobile()

/**
 * Listen change of window size
 */
const appDom = document.getElementById('app')
const modifyMinWidth = function () {
  if (store.getters['config/adaptPlatform']('Desktop')) {
    appDom!.style.minWidth = '1024px'
  } else {
    appDom!.style.minWidth = 'none'
  }
}
store.commit('addResizeEvent',
  {
    name: 'listenWindowSize',
    fn: modifyMinWidth,
    debounce: 444
  })
store.subscribe((m) => {
  if (m.type == 'config/platform')
    modifyMinWidth()
})
// Modify min-width of body
modifyMinWidth()

/**
 * Set the theme of App
 */
class Theme {
  static updateThemeToStyle: Function = () => { }
  static appTheme = ref<ThemeConfig>({})

  private static themeToken: GlobalToken
  private static themeTokenStyleVar: string

  static setTheme(value: ThemeConfig): void {
    Theme.appTheme.value = value

    Theme.updateThemeStyle()
  }

  /**
   * TODO: Performed only once.
   * This fuction is performed only once after DOM updated.
   * The purpose is to get theme token after set theme.
   * Because function nextTick() is not work with module 'theme.useToken()'.
   */
  private static updateThemeStyle() {
    Theme.updateThemeToStyle = () => {
      Theme.themeTokenStyleVar = ''
      Theme.themeToken = theme.useToken().token.value
      for (let key in Theme.themeToken)
        Theme.themeTokenStyleVar +=
          '--' + key + ':' + Theme.themeToken[key as keyof typeof Theme.themeToken] + ';'

      store.commit('config/themeToken', Theme.themeToken)
      document.body.style.cssText = Theme.themeTokenStyleVar

      Theme.updateThemeToStyle = () => { }
    }
  }

  /**
   * TODO: Update Antd token.
   * We must use spread operator to create new theme object,
   * or else OnUpdated() is not called,
   * that will cause no any change of Antd theme token.
   */
  static onDark(on: boolean = true) {
    let themeTemp = { ...Theme.appTheme.value }
    themeTemp.algorithm = on ? theme.darkAlgorithm : theme.defaultAlgorithm
    Theme.appTheme.value = themeTemp
    Theme.updateThemeStyle()
    store.commit('config/ondark', on)
    cookie.set('ondark', on ? 'true' : 'false')
  }
}
provide('onDark', Theme.onDark)

/**
 * Theme style of dark or light.
 */
const initDarkStyle = function () {
  // Get onDark
  const ondarkC = cookie.get('ondark') == 'true' ? true : false
  if (ondarkC)
    Theme.onDark()
}

/**
 * Hook
 */
onMounted(() => {
  // Default theme.
  Theme.setTheme({
    token: {
      "colorPrimary": "#1e80ff",
      "fontSize": 14,
      "borderRadius": 6,
    },
  })

  initDarkStyle()
})
onUpdated(() => {
  Theme.updateThemeToStyle()
})

</script>

<template>
  <div id="app-">
    <a-config-provider :theme="Theme.appTheme.value">
      <SigninEventRegister></SigninEventRegister>
      <CookieHandle></CookieHandle>
      <RouterView></RouterView>
    </a-config-provider>
  </div>
</template>

<style>
#app- {
  width: 100%;
  height: 100%;
}
</style>