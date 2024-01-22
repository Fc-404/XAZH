<template>
  <div>
    <section name="cover">
      <p class="title">博客封面</p>
      <a-tabs
        tabPosition="left"
        :tabBarStyle="{
          maxHeight: '20rem'
        }"
      >
        <a-tab-pane
          v-for="[k] in Object.entries(coverData)"
          :key="k"
          :tab="k"
        >
          <div style="height: 20rem; overflow-x: auto;">
            <PicListAndUpload gap="0" size="6rem"></PicListAndUpload>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-space-compact style="margin-top: 2rem;">
        <a-input></a-input>
        <a-button type="primary">添加标签</a-button>
      </a-space-compact>
    </section>
    <section name="tags">
      <p class="title">博客标签</p>
      tags
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute()

/**
 * Cover.
 */
const coverData = reactive<Record<string, string[]>>({})
coverData['推荐'] = []
coverData['语言'] = []
coverData['领域'] = []
coverData['风景'] = []


const toAnchor = function () {
  const set = function (v: any) {
    const dom = document.getElementsByName(v.toString())
    if (dom.length)
      dom[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  set(route.params['sub'])
  watch(() => route.params['sub'], v => set(v))
}

onMounted(() => {
  toAnchor()
})
</script>

<style scoped>
@import url(../../../assets/css/ctlpanel.less);

section {
  min-height: 100rem;
}
</style>