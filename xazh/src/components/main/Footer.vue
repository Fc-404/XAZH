<template>
  <div id="footer">
    <p>Copyright © 夏至XAZH</p>
    <p><b>GitHub:</b>
      <el-link
        href="http://github.com/Fc-404"
        target="_blank"
      >Fc-404</el-link>
    </p>
    <p @click="clickCopy($event, null, 'gjl245869@gmail.com')">
      <b>Gmail:</b> gjl245869@gmail.com
    </p>
    <p
      @click="switchToDesktop"
      v-show="store.getters['config/platform'] != 'Desktop'"
    >
      <el-link>电脑版</el-link>
    </p>
  </div>
</template>

<script setup lang="ts">

import { useStore } from "vuex";
import { clickCopy } from "../../tools/clickCopy.tool.ts";

const store = useStore()

const switchToDesktop = function (): void {
  store.commit('config/platform', 'Desktop')
}

</script>

<style scoped lang="scss">
#footer {
  padding-top: 1rem;
  padding-bottom: 2rem;

  p {
    color: var(--el-text-color-regular);
    font-size: 0.6rem;
    padding-top: 12px;
    text-align: center;
    line-height: 1.2rem;
  }

  .el-link {
    font-size: inherit;
  }
}</style>