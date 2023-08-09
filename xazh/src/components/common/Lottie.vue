<template>
  <div id="lottie">
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

var lottieDom: Element
var animItem: any
const uuid = ref<string>(uid())

onMounted(() => {
  lottieDom = document.getElementById('lottie') as Element
  animItem = lottie.loadAnimation({
    name: uuid.value,
    container: lottieDom,
    // @ts-ignore
    renderer: props.render,
    loop: props.loop,
    autoplay: props.autoplay,
    path: props.path
  })

  animItem.play('lottie')
})

onUnmounted(() => {
  lottie.destroy(uuid.value)
})
</script>

<style scoped lang="less">
#lottie {
  width: 100%;
  height: 100%;
}
</style>