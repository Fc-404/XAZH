<!-- Editor
  - You can use the getValue method within ref in the parent component
  - to get the contents.
  - And also use Component Event to write backcall function whereby
  - that will be call if you click the send button in this component.
 /-->

<template>
  <div id="md-editor">
    <mavon-editor
      id="md-editor-"
      fontSize="1rem"
      toolbarsBackground="var(--colorBgContainer)"
      previewBackground="var(--colorBgLayout)"
      :boxShadow="false"
      :toolbars="toolbars"
      :subfield="editorOptions.subfield"
      :defaultOpen="editorOptions.defaultOpen"
      :editable="editorOptions.editable"
      :toolbarsFlag="editorOptions.toolbarsFlag"
      :placeholder="editorOptions.placeholder"
      v-model="content"
    >
      <template
        #left-toolbar-before
        v-if="porps.mode == 'tiny'"
      >
        <a-button
          type="text"
          class="top-3"
          title="表情"
        >
          <SmileOutlined />
        </a-button>
        <a-button
          type="text"
          class="top-3"
          title="图片"
        >
          <PictureOutlined />
        </a-button>
      </template>
      <template
        #right-toolbar-after
        v-if="porps.mode == 'tiny'"
      >
        <a-button
          type="text"
          @click="tinyPreview()"
          aria-hidden="true"
          title="预览"
          class="top-3"
        >
          <EyeOutlined v-show="!tinyData.preview" />
          <EyeInvisibleOutlined
            v-show="tinyData.preview"
            style="margin-left: 0 !important;"
          />
        </a-button>
        <a-button
          type="primary"
          class="top-3"
          @mouseenter="tinyPreview(false)"
          @mouseleave="tinyPreview(true)"
          @click="$emit('send', content)"
        >发送</a-button>
      </template>
    </mavon-editor>
  </div>
</template>

<script setup lang="ts">
import mavon from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {
  EyeOutlined, EyeInvisibleOutlined,
  SmileOutlined, PictureOutlined
} from '@ant-design/icons-vue';

const porps = defineProps({
  // MODE:
  // edit, show, tiny. 
  mode: { type: String, default: 'edit' },
  value: { type: String}
})

const mavonEditor = mavon.mavonEditor
const toolbars = porps.mode == 'edit' ? undefined : {}
const editorOptions = reactive({
  subfield: false,
  defaultOpen: 'edit',
  editable: true,
  toolbarsFlag: true,
  placeholder: '开始编辑...'
})

/**
 * Events for MODE of tiny.
 */
const tinyData = reactive({
  preview: false
})
const tinyPreview = function (is?: boolean | undefined) {
  let p = tinyData.preview
  if (is !== undefined) p = is
  editorOptions.defaultOpen = p ? 'edit' : 'preview'
  tinyData.preview = !p
}

/**
 * Content deal.
 */
const content = ref<string>()
const getValue = function () {
  return content
}

defineExpose({
  getValue
})

/**
 * HOOK
 */
onMounted(() => {
  // Set editor options
  switch (porps.mode) {
    case 'edit':
      editorOptions.subfield = true
      editorOptions.defaultOpen = ''
      break
    case 'show':
      editorOptions.defaultOpen = 'preview'
      editorOptions.editable = false
      editorOptions.toolbarsFlag = false
      break
    case 'tiny':
    default:
      editorOptions.placeholder = '回车键发送...'
  }

  content.value = porps.value
})

</script>

<style lang="less" scoped>
#md-editor {
  width: 100%;
  height: 100%;
  margin: auto;

  &- {
    min-height: 100% !important;
    max-height: 100% !important;
  }

  .top-3 {
    margin-top: 4px !important;
  }
}
</style>