<template>
  <div id="uploadPicList">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      style="display: block;"
      accept="image/jpg,image/jpeg,image/png,image/gif"
      :multiple="true"
      @preview="handlePreview"
      @remove="removeFile"
      :custom-request="uploadFile"
    >
      <div v-show="(fileList?.length ?? 0 < props.maxList) || !props.maxList">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="previewImage"
      />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { message, type UploadProps } from 'ant-design-vue';
import { UploadFileAPI, GetFileInfoAPI } from '../../api/file.api';
import { useStore } from 'vuex';

const props = defineProps({
  direction: {
    type: String,
    default: 'row'
  },
  size: {
    type: String,
    default: '6rem'
  },
  gap: {
    type: String,
    default: '.5rem'
  },
  length: {
    type: String,
    default: '100%'
  },
  maxList: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array<string>,
    default: []
  },
  onUploaded: {
    type: Function,
    default: () => { }
  },
  onDelect: {
    type: Function,
    default: () => { }
  }
})

const store = useStore()

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadProps['fileList']>([])

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
}
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
}

/**
 * Upload File.
 */
const uploadFile = async function (options: any) {
  try {
    const { file } = options
    console.log(options);

    const md5 = await UploadFileAPI(file.name, file, (e) => {
      options.onProgress(e.progress)
    })
    if (!md5) {
      options.onError()
      return
    }
    // Deduplication
    for (let element of fileList.value ?? []) {
      if (element.uid == md5) {
        options.onError()
        message.error('图片重复！')
        return
      }
    }
    file['md5'] = md5
    props.onUploaded(options)
    options.onSuccess()
  } catch (e) {
    console.error('客户端文件上传错误：', e)
    options.onError()
  }
}

/**
 * Remove File.
 */
const removeFile = function (options: any) {
  props.onDelect(options)
}

/**
 * Initialise list.
 */
const initList = function () {
  props.list.forEach((i: string) => {
    fileList.value?.push({
      uid: i,
      name: 'image',
      url: store.getters['config/baseApi'] + 'File/' + i
    })
  })
}
initList()
const getFileName = function () {
  fileList.value?.forEach(i => {
    GetFileInfoAPI(i.uid).then(r => {
      let name = r.data?.body['fileName']
      name ? i.name = name : null
    })
  })
}

/**
 * Initialise css.
 */
const setItemCSS = function () {
  const picItemsDom = document.querySelectorAll('#uploadPicList .ant-upload-list-item-container:not([set])')
  picItemsDom.forEach(i => {
    ; (i as HTMLElement).style.cssText = `
      width: ${props.size} !important;
      height: ${props.size} !important;
    `
      ; (i as HTMLElement).setAttribute('set', '')
  })
}
const initCSS = function () {
  const containerDom = document.querySelector('#uploadPicList .ant-upload-list-picture-card')
  const picuploadDom = document.querySelector('#uploadPicList .ant-upload-select-picture-card')

    ; (containerDom as HTMLElement).style.cssText = `
      display: flex;
      flex-direction: ${props.direction == 'row' ? 'row' : 'column'};
      width: ${props.direction == 'row' ? props.length : 'auto'};
      height: ${props.direction == 'row' ? 'auto' : props.length};
      flex-wrap: wrap;
      align-content: start;
    `

    ; (picuploadDom as HTMLElement).style.cssText = `
      width: ${props.size} !important;
      height: ${props.size} !important;
    `
  setItemCSS()
}

onMounted(() => {
  initCSS()
  getFileName()
})
onUpdated(() => {
  setItemCSS()
})
</script>
<style scoped lang="less"></style>
