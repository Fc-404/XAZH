<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
    >
      <img
        v-if="havePic"
        alt="avatar"
      />
      <div v-else>
        <LoadingOutlined v-if="loading"></LoadingOutlined>
        <PlusOutlined v-else></PlusOutlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';

const fileList = ref()
const havePic = ref<boolean>(false)
const loading = ref<boolean>(false)
</script>

<style scoped>
.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>