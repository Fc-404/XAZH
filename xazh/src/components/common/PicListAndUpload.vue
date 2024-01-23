<template>
  <a-image-preview-group>
    <div
      id="piclist-upload"
      :style="{
        flexDirection: props.direction == 'row' ? 'row' : 'column',
        width: props.direction == 'row' ? props.length : 'auto',
        height: props.direction == 'row' ? 'auto' : props.length
      }"
    >
      <div
        v-for="i in 20"
        :style="{
          margin: props.gap
        }"
      >
        <a-image
          :key="i"
          src="/logo.png"
          :style="{
            width: props.direction == 'row' ? 'auto' : props.size,
            height: props.direction == 'row' ? size : 'auto'
          }"
        ></a-image>
      </div>
      <!-- <PicUpload id="piclist-upload-upload"></PicUpload> -->
      <a-upload></a-upload>
    </div>
  </a-image-preview-group>
</template>

<script setup lang="ts">

const props = defineProps({
  direction: {
    type: String,
    default: 'column'
  },
  gap: {
    type: String,
    default: '.5rem'
  },
  size: {
    type: String,
    default: '5rem'
  },
  length: {
    type: String,
    default: '100%'
  },
  items: {
    type: Array,
    default: []
  }
})

</script>

<style scoped lang="less">
#piclist-upload {
  display: flex;
  flex-wrap: wrap;
  align-content: start;

  &-upload {
    padding: 1rem;
  }
}
</style>