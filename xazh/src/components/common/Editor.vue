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
    >
      <template
        #left-toolbar-before
        v-if="porps.type == 'tiny'"
      >
        <a-button
          type="text"
          class="top-3"
        >
          <SmileOutlined />
        </a-button>
        <a-button
          type="text"
          class="top-3"
        >
          <PictureOutlined />
        </a-button>
      </template>
      <template
        #right-toolbar-after
        v-if="porps.type == 'tiny'"
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
  // edit, show, tiny. 
  type: { type: String, default: 'edit' },
})

const mavonEditor = mavon.mavonEditor
const toolbars = porps.type == 'edit' ? undefined : {}
const editorOptions = reactive({
  subfield: false,
  defaultOpen: 'edit',
  editable: true,
  toolbarsFlag: true,
  placeholder: '开始编辑...'
})


/**
 * Tiny Events
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
 * HOOK
 */
onMounted(() => {
  // Set editor options
  switch (porps.type) {
    case 'edit':
      editorOptions.subfield = true
      editorOptions.defaultOpen = ''
      break
    case 'show':
      editorOptions.defaultOpen = 'preview'
      editorOptions.editable = false
      editorOptions.toolbarsFlag = false
      break
    default:
      editorOptions.placeholder = '回车键发送...'
  }
})

</script>

<style lang="less" scoped>
#md-editor {
  width: 50vw;
  height: 20vh;
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