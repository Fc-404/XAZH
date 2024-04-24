<template>
  <div id="signinModal" v-show="props.open" @click="$emit('update:open', false)">
    <Signup @click.stop :mStyle="{ boxShadow: 'var(--boxShadowSecondary)' }" @signin-success="sugninSuccess"></Signup>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['signinSuccess', 'update:open'])
const sugninSuccess = function () {
  emit('update:open', false)
  emit('signinSuccess')
}
</script>

<style scoped lang="less">
#signinModal {
  width: 100vw;
  height: 100vh;
  padding-top: 10rem;
  position: fixed;
  top: 0;
  z-index: 999;
  background: #e5e5e55e !important;
  backdrop-filter: blur(.5rem) saturate(180%);
  box-shadow: var(--boxShadowSecondary);
}
</style>