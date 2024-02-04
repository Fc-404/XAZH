<template>
  <div id="main">
    <a-layout>
      <a-layout-header id="main-header">
        <Header></Header>
      </a-layout-header>
      <a-layout-content id="main-">
        <RouterView
          style="min-height: 1024px;"
          v-slot="{ Component }"
        >
          <transition
            name="slide"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </a-layout-content>
      <a-layout-footer
        id="main-footer"
        :style="footerStyle"
      >
        <Footer></Footer>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">

/**
 * Configure the footer size.
 */
const footerStyle = reactive({
  width: '100%',
  marginLeft: '0'
})
provide('setFooterMargin', (x: string = '') => {
  if (!x) {
    footerStyle.width = '100%'
    footerStyle.marginLeft = '0'
  }
  footerStyle.width = `calc(100% - ${x[0] == '-' ? x.slice(1) : x})`
  x[0] == '-' ? footerStyle.marginLeft = x.slice(1) : null
})

</script>

<style scoped lang="less">
#main {
  #main-header {
    padding: 0;
    background-color: transparent;
  }
}
</style>