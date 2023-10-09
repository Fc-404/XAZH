<template>
  <div id="editp">
    <div id="editp-head">
      <a-button type="text" @click="back">
        <LeftOutlined style="margin-left: -6px;" />
        返回
      </a-button>
      <div style="width: 1rem;"></div>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <a-input
        placeholder="标题"
        :bordered="false"
        :maxlength="64"
        show-count
        v-model:value="title"
      ></a-input>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <div style="width: 1.8rem;"></div>
      <a-button type="primary">发布</a-button>
    </div>
    <div id="editp-">
      <Editor
        :save="save"
        :value="draftContent"
        style="position: relative; z-index: 99;"
        ref="editor"
      ></Editor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined } from '@ant-design/icons-vue';
import { message, notification } from 'ant-design-vue';
import cookie from 'js-cookie'
import { useStore } from 'vuex';

const store = useStore()

const title = ref<string>()
const draftContent = ref<string>()
const editor = ref()
let autoSaveHandle

/**
 * Save content to cookie.
 * @param v Editor content.
 */
const save = function (v: string) {
  const draft = {
    title: title.value,
    content: v,
    time: new Date(),
  }

  cookie.set('EditBlog/draft', JSON.stringify(draft))
  message.success('草稿已保存到本地！')
}

/**
 * Loading content from cookie.
 */
const loadingDraft = function () {
  try {
    const draft = JSON.parse(cookie.get('EditBlog/draft') || '')

    title.value = draft.title
    draftContent.value = draft.content

    const time = new Date(draft.time)
    notification.success({
      message: '加载草稿成功！',
      description: h('table', [
        h('tr', [
          h('td', '标题：'),
          h('td', `${title.value}`),
        ]),
        h('tr', [
          h('td', '上次保存时间：'),
          h('td', `${time.getFullYear()}年${time.getMonth()}月${time.getDate()}日`),
        ])
      ])
    })
  } catch {
    return
  }
}

/**
 * back
 */
const back = function() {
  save(editor.value.content)
}

/**
 * HOOK
 */
onBeforeMount(() => {
  loadingDraft()
})
onMounted(() => {
  window.onbeforeunload = function () {
    return '未保存草稿！'
  }
  autoSaveHandle = setInterval(()=>{
    save(editor.value.content)
  }, store.getters['pconf/blogsEditorAutoSave'] || 30000)
})
onUnmounted(() => {
  window.onbeforeunload = null
})
</script>

<style scoped lang="less">
#editp {
  background: var(--colorBgLayout);

  &-head {
    height: 2rem;
    padding: .2rem 1.8rem .2rem .2rem;
    display: flex;

    .ant-input-affix-wrapper {
      font-size: 1.1rem;
    }
  }

  &- {
    height: calc(100vh - 2.4rem);
  }
}
</style>