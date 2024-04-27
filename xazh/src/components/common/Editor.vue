<!-- Editor
  - You can use the getValue method within ref in the parent component
  - to get the contents.
  - And also use Component Event to write backcall function whereby
  - that will be call if you click the send button in this component.
 /-->

<template>
  <div id="md-editor">
    <mavon-editor
      ref="vm"
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
      :xssOptions="editorOptions.xssOptions"
      @imgAdd="addImg"
      @imgDel="delImg"
      @save="save"
      v-model="content"
    >
      <template #left-toolbar-before v-if="props.mode == 'tiny'">
        <a-button type="text" class="top-3" title="表情">
          <SmileOutlined />
        </a-button>
        <a-button type="text" class="top-3" title="图片">
          <PictureOutlined />
        </a-button>
      </template>
      <template #right-toolbar-after v-if="props.mode == 'tiny'">
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
            style="margin-left: 0 !important"
          />
        </a-button>
        <a-button
          type="primary"
          class="top-3"
          @mouseenter="tinyPreview(false)"
          @mouseleave="tinyPreview(true)"
          @click="$emit('send', content)"
          >发送
        </a-button>
      </template>
    </mavon-editor>
  </div>
</template>

<script setup lang="ts">
import mavon from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SmileOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue'
import { DeleteFileAPI, UploadFileAPI } from '../../api/file.api'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  // MODE:
  // edit, show, tiny.
  mode: { type: String, default: 'edit' },
  value: { type: String }, // default value
  save: { type: Function, default: () => null }, // backcall of save event
})

const mavonEditor = mavon.mavonEditor
const vm = ref()
const toolbars = props.mode == 'edit' ? undefined : {}
const editorOptions = reactive({
  subfield: false,
  defaultOpen: 'edit',
  editable: true,
  toolbarsFlag: true,
  placeholder: '开始编辑...',
  xssOptions: {
    whiteList: {
      span: ['style'],
      b: ['style'],
      i: ['style'],
      em: ['style'],
      small: ['style'],
      strong: ['style'],
      kbd: ['style'],
    },
  },
})

/**
 * Image events.
 */
const addImg = async function (pos: number, file: File) {
  const fid = await UploadFileAPI(file.name, file)
  vm.value.$img2Url(pos, store.getters['config/fileUrl'](fid))
  props.save ? props.save() : null
}
const delImg = async function (pos: any) {
  console.log(pos)
  const url = pos[0]
  const fid = url.split('/').pop()
  await DeleteFileAPI(fid)
  props.save ? props.save() : null
}

/**
 * Events for MODE of tiny.
 */
const tinyData = reactive({
  preview: false,
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
const content = ref<string>(props.value ?? '')
defineExpose({ content })

/**
 * HOOK
 */
// onMounted(() => {
// Set editor options
switch (props.mode) {
  case 'edit':
    editorOptions.subfield = true
    editorOptions.defaultOpen = ''
    break
  case 'show':
    editorOptions.defaultOpen = 'preview'
    // editorOptions.editable = false
    editorOptions.subfield = false
    editorOptions.toolbarsFlag = false
    break
  case 'tiny':
  default:
    editorOptions.placeholder = '回车键发送...'
}
// })
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
