<template>
  <div id="blogoptions">
    <section
      name="cover"
      id="blogoptions-cover"
    >
      <p class="title">博客封面</p>
      <a-tabs
        v-model:active-key="coverActiveKey"
        tabPosition="left"
        :tabBarStyle="{
          maxHeight: '20rem'
        }"
      >
        <a-tab-pane
          v-for="i in coverData"
          :key="i.tag"
          :tab="i.tag"
        >
          <div id="blogoptions-cover-tag-view">
            <UploadPicList
              :list="i.value"
              @onUpload="uploadedPic($event, i.value)"
              @onDelete="deletedPic($event, i.value)"
            ></UploadPicList>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div id="blogoptions-cover-tags-">
        <div id="blogoptions-cover-tags-view">
          <VueDraggable
            v-model="coverData"
            :animation="150"
            ghostClass="ghost"
            @update="coverTagUpdate"
          >
            <div
              v-for="i in coverData"
              style="display: inline-block;"
            >
              <a-tag
                id="blogoptions-cover-tags-view-item"
                :closable="true"
                @close="deleteTag(i.tag)"
              >{{ i.tag }}</a-tag>
            </div>
          </VueDraggable>
        </div>
        <div id="blogoptions-cover-tags-add">
          <a-space-compact>
            <a-input v-model:value="coverItemNew"></a-input>
            <a-button
              type="primary"
              @click="newCoverItem"
            >添加标签</a-button>
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
import { VueDraggable } from 'vue-draggable-plus'
import { message } from 'ant-design-vue';
import { GetPanelConfigAPI, SetPanelConfigAPI } from '../../../api/panel.api';

const PANEL = 'web'
const GROUP = 'blogoptions'
const route = useRoute()

/**
 * Cover.
 */
type COVER_TYPE = Array<{ tag: string, value: Array<string> }>
const coverData = ref<COVER_TYPE>([])
const coverActiveKey = ref<string>()
const coverItemNew = ref<string>()

/**
 * Get Cover information from server.
 */
const getCover = async function () {
  const result: COVER_TYPE = (await GetPanelConfigAPI(PANEL, 'cover', GROUP))['value']
  result.forEach(i => {
    coverData.value.push({
      tag: i['tag'],
      value: i['value']
    })
  })
}
getCover()

/**
 * New Cover item.
 */
const newCoverItem = async function () {
  for (let i of coverData.value)
    if (i.tag == coverItemNew.value) {
      message.error('标签重复')
      return
    }

  if (coverItemNew.value) {
    coverData.value.push({
      tag: coverItemNew.value,
      value: []
    })
    await SetPanelConfigAPI(PANEL, 'cover', coverData.value, GROUP)
  }
}

/**
 * The order of cover tags has been changed.
 */
const coverTagUpdate = async function () {
  await SetPanelConfigAPI(PANEL, 'cover', coverData.value, GROUP)
}
/**
 * Uploaded or Deleted a cover image.
 */
const uploadedPic = async function (options: any, value: Array<string>) {
  const { file } = options
  const md5 = file.md5
  if (md5) {
    value.push(md5)
    await SetPanelConfigAPI(PANEL, 'cover', coverData.value, GROUP)
  }
}
const deletedPic = async function (options: any, value: Array<string>) {
  const md5 = options.uid
  if (md5) {
    value.splice(value.indexOf(md5), 1)
    await SetPanelConfigAPI(PANEL, 'cover', coverData.value, GROUP)
  }
}
/**
 * To delete the tags.
 */
const deleteTag = async function (tag: string) {
  for (let [i, v] of coverData.value.entries()) {
    if (v.tag == tag) {
      coverData.value.splice(i, 1)
      await SetPanelConfigAPI(PANEL, 'cover', coverData.value, GROUP)
      return
    }
  }
}



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
      padding: 1rem;
      margin: 2rem;
      margin-top: 0;
      border: 1px solid var(--colorBorder);
      border-radius: var(--borderRadius);

      &view {
        width: 100%;

        &-item {
          padding: .2rem .4rem;
          margin-right: 1rem;
          cursor: move;
          color: inherit;
        }

        .ghost {
          color: var(--colorPrimary);
        }
      }

      &add {
        margin-top: 2rem;
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>