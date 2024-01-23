<template>
  <div id="blogoptions">
    <section
      name="cover"
      id="blogoptions-cover"
    >
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
          <div id="blogoptions-cover-tag-view">
            <UploadPicList :list="['8b6681e58c8735fa671da6fc18a85706']"></UploadPicList>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div id="blogoptions-cover-tags-">
        <a-space
          id="blogoptions-cover-tags-view"
          :wrap="true"
        >
          <a-tag
            :closable="true"
            v-for="i in 6"
          >123</a-tag>
        </a-space>
        <div id="blogoptions-cover-tags-add">
          <a-space-compact>
            <a-input></a-input>
            <a-button type="primary">添加标签</a-button>
          </a-space-compact>
        </div>
      </div>
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

<style scoped lang="less">
@import url(../../../assets/css/ctlpanel.less);

#blogoptions {
  &-cover {
    &-tag-view {
      height: 20rem;
      overflow-x: auto;
    }

    &-tags- {
      padding: 3rem 6rem;

      &view {
        width: 100%;
      }

      &add {
        margin-top: 2rem;
        padding-right: 2rem;
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>