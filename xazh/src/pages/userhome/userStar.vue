<template>
  <div>
    <BlogViewList
      v-for="i in starInfo.values"
      :key="i"
      :bid="i.value"
    ></BlogViewList>
  </div>
</template>

<script setup lang="ts">
import { GetUserStarBlogsAPI } from '../../api/blog.api'

const props = defineProps({
  uid: {
    type: String,
    required: true,
  },
})
const starInfo = reactive({
  values: Array<any>(),
  head: '',
  next: '',
})
watch(
  () => props.uid,
  async () => {
    await getUserStarInfo()
  }
)

const getUserStarInfo = async function () {
  const r = await GetUserStarBlogsAPI('Default', props.uid)
  if (!r) return
  Object.keys(starInfo).forEach((k) => {
    // @ts-ignore
    r[k] ? (starInfo[k] = r[k]) : null
  })
  r?.value?.forEach((v: string) => {
    starInfo.values.push({
      chunk: r.node,
      value: v,
    })
  })
  console.log(starInfo)
}

onMounted(async () => {
  await getUserStarInfo()
})
</script>

<style scoped lang="less"></style>
