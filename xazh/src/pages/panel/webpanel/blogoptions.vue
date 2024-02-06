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
              style="height: 100%;"
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
            :animation="200"
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
      <div id="blogoptions-tags">
        <VueDraggable
          v-model="tagsData"
          :animation="200"
          ghostClass="ghost"
          @update="tagsItemUpdate"
        >
          <div
            v-for="i in tagsData"
            style="display: inline-block;"
          >
            <a-tag
              id="blogoptions-tags-"
              :closable="true"
              @close="tagsItemDel(i)"
            >{{ i }}</a-tag>
          </div>
        </VueDraggable>
        <div id="blogoptions-tags-add">
          <a-space-compact>
            <a-input v-model:value="tagsItemNew"></a-input>
            <a-button
              type="primary"
              @click="tagsItemAdd"
            >添加标签</a-button>
          </a-space-compact>
        </div>
      </div>
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
 * ! Cover.
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
      value: [...new Set(i['value'])]
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
    coverItemNew.value = ''
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
  const uid = file.uuid
  if (uid) {
    value.push(uid)
    await coverTagUpdate()
  }
}
const deletedPic = async function (options: any, value: Array<string>) {
  const uid = options.uid
  if (uid) {
    value.splice(value.indexOf(uid), 1)
    await coverTagUpdate()
  }
}
/**
 * To delete the tags.
 */
const deleteTag = async function (tag: string) {
  for (let [i, v] of coverData.value.entries()) {
    if (v.tag == tag) {
      coverData.value.splice(i, 1)
      await coverTagUpdate()
      return
    }
  }
}


/**
 * ! Tags
 */
const tagsData = ref<Array<string>>([])
const tagsItemNew = ref<string>()

const getTags = async function () {
  const result: Array<string> = (await GetPanelConfigAPI(PANEL, 'tags', GROUP))['value']
  result.forEach(i => {
    if (i)
      tagsData.value.push(i)
  })
}
getTags()
const tagsItemUpdate = async function () {
  await SetPanelConfigAPI(PANEL, 'tags', tagsData.value, GROUP)
}
const tagsItemAdd = async function () {
  if (!tagsItemNew.value) return
  if (tagsData.value.indexOf(tagsItemNew.value) == -1) {
    tagsData.value.push(tagsItemNew.value)
    tagsItemNew.value = ''
    await tagsItemUpdate()
  } else {
    message.error('标签重复')
  }
}
const tagsItemDel = async function (name: string) {
  tagsData.value.splice(tagsData.value.indexOf(name), 1)
  await tagsItemUpdate()
  console.log(tagsData.value);
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
      .tags-container();

      &view {
        width: 100%;

        &-item {
          .tags-item();
        }

        .ghost {
          color: var(--colorPrimary);
        }
      }

      &add {
        .tags-add();
      }
    }
  }

  &-tags {
    .tags-container();

    &- {
      .tags-item();
    }

    &-add {
      .tags-add();
    }
  }
}
</style>