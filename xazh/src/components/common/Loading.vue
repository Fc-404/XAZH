<template>
  <div id="Loading">
    <a-spin
      :indicator="indicator"
      :spinning="porps.loading"
      :tip="porps.text"
    ></a-spin>
  </div>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';

const porps = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '2rem',
  },
})

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: porps.size,
  },
  spin: true,
})
</script>

<style lang="less">
#Loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
   
   .anticon-spin {
    -webkit-animation: loadingCircle 1s infinite cubic-bezier(0.6, 0.4, 0.3, 0.7) !important;
    animation: loadingCircle 1s infinite cubic-bezier(0.6, 0.4, 0.3, 0.7) !important;
  }
}
</style>