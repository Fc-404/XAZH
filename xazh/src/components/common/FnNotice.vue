<template>
  <div
    id="fnotice"
    :style="{
      fontSize: fontSize,
    }"
  >
    <div
      :style="{
        height: height,
        marginTop: '1em',
      }"
    >
      <Lottie path="/lottie/developing.json"></Lottie>
    </div>
    <div id="fnotice-tip">
      <p id="fnotice-tip-">
        功能{{ props.maintenance ? '维护' : '开发' }}中...
      </p>
      <p id="fnotice-tip-expect">敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  maintenance: { type: Boolean, default: false },
  size: { type: Number, default: 0 },
})

const height = ref<string>()
const fontSize = ref<string>('3rem')

onMounted(() => {
  if (!props.size) {
    height.value = 'calc(100vh - 4px)'
  } else {
    height.value = props.size * 8 + 'rem'
    fontSize.value = props.size / 2 + 'rem'
  }
})
</script>

<style scoped lang="less">
#fnotice {
  position: relative;
  height: 100%;

  &-tip {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 1em;
    text-align: center;
    display: block;
    font-weight: bold;

    &-expect {
      // line-height: 12em;
      color: #43434343;
      text-align: center;
      width: 100%;
      position: absolute;
      bottom: 30%;
    }

    &- {
      line-height: 4em;
      color: var(--colorTextSecondary);
    }
  }
}
</style>
