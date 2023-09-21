<template>
  <div id="md-editor">
    <mavon-editor id="md-editor-"></mavon-editor>
  </div>
</template>

<script setup lang="ts">
import mavon from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const mavonEditor = mavon.mavonEditor
</script>

<style lang="less" scoped>
#md-editor {
  width: 100%;
  height: 100vh;

  &- {
    min-height: 100% !important;
    max-height: 100% !important;
  }
}
</style>