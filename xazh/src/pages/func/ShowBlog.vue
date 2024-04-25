<template>
  <div id="showblog">
    <div id="showblog-left">
      <div id="showblog-user">
        <img
          class="userimg"
          v-if="userInfo.himg"
          :alt="userInfo.uid"
          :src="store.getters['config/fileUrl'](userInfo.himg)"
        />
        <a-avatar v-else class="userimg" :title="userInfo.uid">{{
          user2ImgText(userInfo.user)
        }}</a-avatar>
      </div>
    </div>
    <div id="showblog-center">
      <div id="showblog-text">
        <h1 id="showblog-text-title">{{ blogInfo.title }}</h1>
        <a-divider>{{ blogInfo.createtime }}</a-divider>
        <Editor
          mode="show"
          style="position: relative; z-index: 99"
          ref="editor"
        ></Editor>
      </div>
    </div>
    <div id="showblog-right"></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { GetBlogInfo } from '../../api/blog.api'
import { useTitle } from '../../composables/useTitle'
import { useHeaderMode } from '../../composables/useHeaderMode'
import { ModeHeaderPageI } from '../../interface/page.i'
import { UsersInfoAPI } from '../../api/base.user.api'
import { useStore } from 'vuex'

import { user2ImgText } from '../../util/str.tool'

const store = useStore()
const route = useRoute()
const editor = ref()

const bid = route.params.bid.toString()
const title = ref<string>()
const blogInfo = reactive({
  title: '',
  author: '',
  type: 0,
  privacy: 0,
  keyword: '',
  abstract: '',
  createtime: 0,
  body: '',
  cover: '',
  readcount: 0,
  starcount: 0,
  likecount: 0,
  commentcount: 0,
  wholike: '',
  whostar: '',
  test: '',
})
const userInfo = reactive({
  uid: '',
  himg: '',
  user: '',
  belong_place: '',
  exp: 0,
  level: 0,
  ranks: '',
  signup_data: '',
  disablee: false,
  deleted: false,
})

const getInfo = async function () {
  const c = await GetBlogInfo(bid)
  if (!c) return
  Object.keys(blogInfo).forEach((k) => {
    // @ts-ignore
    c[k] ? (blogInfo[k] = c[k]) : null
  })
  editor.value.content = blogInfo.body
  title.value = blogInfo.title

  userInfo['uid'] = blogInfo.author
  const u = await UsersInfoAPI([blogInfo.author])
  if (!u) return
  Object.keys(userInfo).forEach((k) => {
    // @ts-ignore
    u[blogInfo.author][k] ? (userInfo[k] = u[blogInfo.author][k]) : null
  })
  console.log(userInfo)
}
useTitle(title)
useHeaderMode(ModeHeaderPageI.SCROLL)

onMounted(async () => {
  await getInfo()
  console.log(blogInfo)
})
</script>

<style scoped lang="less">
#showblog {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &-center {
    min-width: 32rem;
    max-width: 64rem;
    margin: 2rem 0 2rem 0;
  }
  &-left,
  &-right {
    margin: 2rem 1rem;
    width: 20rem;
    height: 20rem;
    background-color: blue;
  }

  &-text {
    padding: 1rem;

    &-title {
      font-size: 2rem;
      color: var(--colorText);
      text-align: center;
    }
  }

  &-user {
    width: 20rem;
    height: 20rem;
    background-color: red;

    .userimg {
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      box-shadow: none;
      font-size: 3.5rem;
      line-height: 5.5rem;
    }
  }
}
</style>
