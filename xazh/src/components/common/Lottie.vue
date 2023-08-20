<template>
  <div
    ref="dom"
    class="lottie"
  >
  </div>
</template>

<script setup lang="ts">
import lottie from 'lottie-web'
import { uid } from 'uid/single'

const props = defineProps({
  render: { type: String, default: 'svg' },
  loop: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  path: { type: String, default: 'lottie/default.json' }
})

var animItem: any
const uuid = ref<string>(uid())
const dom = ref<HTMLElement>()

onMounted(() => {
  animItem = lottie.loadAnimation({
    name: uuid.value,
    container: dom.value as Element,
    // @ts-ignore
    renderer: props.render,
    loop: props.loop,
    autoplay: props.autoplay,
    path: props.path
  })

  animItem.play(uuid.value)
})

onUnmounted(() => {
  lottie.destroy(uuid.value)
})
</script>

<style scoped lang="less">
.lottie {
  width: 100%;
  height: 100%;
}</style>