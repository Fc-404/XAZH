<template>
  <div id="uploadpic" :uid="id">
    <a-upload
      name="avatar"
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="customReq"
      accept="image/jpg,image/jpeg,image/png,image/gif"
    >
      <Loading
        v-if="uploadState === undefined"
        id="uploadpic-loading"
      ></Loading>
      <img
        v-if="uploadState === false"
        id="uploadpic-preview"
        :src="previewSrc"
        alt="预览"
        style="border-radius: 5px"
      />
      <div v-if="uploadState === true">
        <PlusOutlined></PlusOutlined>
        <p>上传</p>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { UploadFileAPI } from '../../api/file.api'
import { uid } from 'uid/single'
import { useStore } from 'vuex'

const id = ref<string>(uid())
const store = useStore()
const props = defineProps({
  commit: Boolean,
  fid: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: 'none',
  },
  width: {
    type: String,
    default: 'auto',
  },
  height: {
    type: String,
    default: 'auto',
  },
  // To control upload function.
  // If true, must call this component's upload function to actual upload.
  uploadCtl: {
    type: Boolean,
    default: false,
  },
})

// true if not select, false if selected, undefined if loading.
const emit = defineEmits(['update:fid'])
const uploadState = ref<boolean | undefined>(true)
const previewSrc = ref<string>()
let file: File
console.log(props.fid)

const updateState = function () {
  uploadState.value = props.fid ? false : true
  if (uploadState.value === false && props.fid !== 'wait') {
    previewSrc.value = store.getters['config/fileUrl'](props.fid)
  }
}
updateState()
watch(() => props.fid, updateState)

/**
 * Upload Pictrue.
 */
const uploadPic = async function () {
  if (props.fid != 'wait') return props.fid
  uploadState.value = undefined
  const result = await UploadFileAPI(file.name, file)
  uploadState.value = false
  return result
}
const customReq = async function (options: any) {
  previewSrc.value = (await getBase64(options.file)) as string
  uploadState.value = false
  file = options.file
  emit('update:fid', 'wait')

  if (!props.uploadCtl) uploadPic()
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const setCSS = function () {
  let width = '6rem'
  let height = '6rem'
  if (props.size != 'none') {
    width = height = props.size
  } else if (props.width == 'auto' && props.height == 'auto') null
  else if (props.width == 'auto') {
    height = props.height
    width = 'auto'
  } else {
    width = props.width
    height = 'auto'
  }
  const picDom = document.querySelector(
    `#uploadpic[uid="${id.value}"] .ant-upload-select-picture-card`
  )

  ;(picDom as HTMLElement).style.cssText = `
      width: ${width};
      height: ${height};
      overflow: hidden;
      padding: 2px;
    `
}

defineExpose({
  upload: uploadPic,
})
onMounted(() => {
  setCSS()
})
</script>

<style scoped lang="less">
#uploadpic {
  position: relative;

  &-preview {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  &-loading {
    position: absolute;
  }
}
</style>
