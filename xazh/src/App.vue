<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { theme } from 'ant-design-vue'
import { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import { GlobalToken } from 'ant-design-vue/es/theme'

const store = useStore()

/**
 * Jump to the main page by default.
 */
useRouter().replace({
  name: 'Main'
})

/**
 * Switch what style of display in the light of
 * change of window width and user's selection.
 */
if (window.outerWidth <= 1024) {
  store.commit('config/platform', 'Mobile')
}

/**
 * Set the theme of App
 */
class Theme {
  static updateThemeToStyle: Function = () => { }
  static appTheme = ref<ThemeConfig>({})

  private static themeToken: GlobalToken
  private static themeTokenStyleVar: any = {}

  static setTheme(value: ThemeConfig): void {
    Theme.appTheme.value = value

    Theme.updateStyleTheme()
  }

  /**
   * TODO: Performed only once.
   * This fuction is performed only once after DOM updated.
   * The purpose is to get theme token after set theme.
   * Because function nextTick() is not work with module 'theme.useToken()'.
   */
  private static updateStyleTheme() {
    Theme.updateThemeToStyle = () => {
      Theme.themeTokenStyleVar = {}
      Theme.themeToken = theme.useToken().token.value
      for (let key in Theme.themeToken)
        Theme.themeTokenStyleVar['--' + key] = Theme.themeToken[key as keyof typeof Theme.themeToken]

      $('body').css(Theme.themeTokenStyleVar)

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
    Theme.updateStyleTheme()
    store.commit('config/ondark', on)
  }
}
provide('onDark', Theme.onDark)

onMounted(() => {
  // Default theme.
  Theme.setTheme({
    token: {
      "colorPrimary": "#ff85c0",
      "fontSize": 14,
      "borderRadius": 6,
    },
  })

  // setTimeout(() => {
  //   Theme.onDark(true)
  // }, 3000);

})

onUpdated(() => {
  Theme.updateThemeToStyle()
})
</script>

<template>
  <div id="app">
    <a-config-provider :theme="Theme.appTheme.value">
      <router-view></router-view>
      <!-- <FnNotice :size="5.6"></FnNotice> -->
    </a-config-provider>
  </div>
</template>

<style lang="less" src="./style.less"></style>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>