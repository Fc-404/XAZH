<template>
  <div id="showblog">
    <a-affix :offsetTop="64">
      <div id="showblog-left">
        <div id="showblog-user">
          <UserInfoCard :info="userInfo"></UserInfoCard>
          <div
            id="showblog-user-ctl"
            v-if="userInfo.uid != store.getters['signin/id']"
          >
            <a-button
              class="btn"
              type="primary"
              size="small"
              :style="{
                background: actState.follow
                  ? 'var(--colorFill)'
                  : 'var(--colorPrimary)',
              }"
              @click="followAuthor"
              :loading="actState.follow === undefined"
            >
              {{ actState.follow ? '取关' : '关注' }}
            </a-button>
            <a-button class="btn" type="default" size="small">私信</a-button>
          </div>
        </div>
        <div id="showblog-interact">
          <div>
            <a-button
              size="large"
              type="text"
              shape="circle"
              class="interact-btn"
              @click="likeBlog"
              :disabled="actState.like == undefined"
            >
              <LikeOutlined v-if="actState.like == false"></LikeOutlined>
              <LikeFilled v-else style="color: #ff7875"></LikeFilled>
              <LoadingOutlined
                v-show="actState.like == undefined"
                style="position: absolute; left: 0"
              ></LoadingOutlined>
            </a-button>
            <!-- <p>{{ blogInfo.likecount }}</p> -->
            <p>{{ numberFormat(blogInfo.likecount) }}</p>
          </div>
          <div>
            <a-tooltip>
              <template #title>待开发...</template>
              <a-button
                size="large"
                type="text"
                shape="circle"
                class="interact-btn"
              >
                <CommentOutlined></CommentOutlined>
              </a-button>
            </a-tooltip>
            <p>{{ numberFormat(blogInfo.commentcount) }}</p>
          </div>
          <div>
            <a-button
              size="large"
              type="text"
              shape="circle"
              class="interact-btn"
              @click="starBlog"
            >
              <StarOutlined v-if="actState.star == false"></StarOutlined>
              <StarFilled v-else style="color: #f3d50e"></StarFilled>
              <LoadingOutlined
                v-show="actState.star == undefined"
                style="position: absolute; left: 0"
              ></LoadingOutlined>
            </a-button>
            <p>{{ numberFormat(blogInfo.starcount) }}</p>
          </div>
        </div>
      </div>
    </a-affix>
    <div id="showblog-center">
      <div id="showblog-text">
        <h1 id="showblog-text-title">{{ blogInfo.title }}</h1>
        <div id="showblog-text-info">
          <span>
            <a-tag
              :bordered="false"
              :color="getBlogTypeColor(blogInfo.type)"
              style="cursor: pointer"
            >
              {{ getBlogTypeName(blogInfo.type) }}
            </a-tag>
          </span>
          <span style="color: var(--colorTextSecondary)">
            字数：{{ numberFormat(blogInfo.body.length) }}
            <a-divider type="vertical"></a-divider>
            阅读量：{{ numberFormat(blogInfo.readcount, 2) }}
          </span>
        </div>
        <p v-if="blogInfo.type == 1" id="showblog-text-cc">
          本文为博主原创文章，遵循
          <a
            target="_blank"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans"
          >
            CC 4.0 BY-SA
          </a>
          版权协议，转载请附上原文出处链接和本声明
          <span style="float: right">
            <a title="待开发">举报</a>
          </span>
        </p>
        <div id="showblog-text-tags">
          <a-tag v-for="i in blogInfo.keywords" :bordered="false">{{
            i
          }}</a-tag>
        </div>
        <a-divider style="font-size: 0.8rem; color: var(--colorTextTertiary)">{{
          formatDate('YYYY年MM月DD日 hh:mm', new Date(blogInfo.createtime))
        }}</a-divider>
        <Editor
          mode="show"
          style="position: relative; z-index: 99"
          ref="editor"
        ></Editor>
      </div>
    </div>
    <div id="showblog-right" v-if="false"></div>
    <div id="showblog-func">
      <a-button
        type="primary"
        shape="circle"
        size="large"
        class="btn"
        title="回到顶部"
        @click="scrollTop"
      >
        <VerticalAlignTopOutlined style="margin-top: 0.1rem" />
      </a-button>
      <a-button
        type="primary"
        shape="circle"
        size="large"
        class="btn"
        title="分享链接"
        @click="clickCopy($event, null, url)"
      >
        <ShareAltOutlined style="margin-right: 0.1rem" />
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = window.location.href
import { useRoute, useRouter } from 'vue-router'
import {
  GetBUInteractionAPI,
  GetBlogAPI,
  LikeBlogAPI,
  ReadBlogAPI,
  StarBlogAPI,
  UnstarBlogAPI,
} from '../../api/blog.api'
import { clickCopy } from '../../util/clickCopy.tool'
import { useTitle } from '../../composables/useTitle'
import { useHeaderMode } from '../../composables/useHeaderMode'
import { ModeHeaderPageI } from '../../interface/page.i'
import { UsersInfoAPI } from '../../api/base.user.api'
import { formatDate } from '../../util/formatDate.tool'
import { getBlogTypeColor, getBlogTypeName } from '../../types/blog.type'
import { numberFormat } from '../../util/str.tool'
import UserInfoCard from '../../components/common/UserInfoCard.vue'
import { useStore } from 'vuex'
import {
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  StarOutlined,
  StarFilled,
  LoadingOutlined,
  VerticalAlignTopOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  FollowUserAPI,
  GetRelationInteractionAPI,
  UnfollowUserAPI,
} from '../../api/relation.api'

const route = useRoute()
const router = useRouter()
const store = useStore()
const editor = ref()

const bid = route.params.bid.toString()
const title = ref<string>()
const blogInfo = reactive({
  title: '',
  author: '',
  type: 0,
  privacy: 0,
  keywords: [],
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
  signup_date: '',
  disabled: false,
  deleted: false,
})
const actState = reactive<{ [key: string]: boolean | undefined }>({
  like: false,
  star: false,
  follow: false,
})

const getInfo = async function () {
  // Get the blog's information
  const c = await GetBlogAPI(bid)
  if (!c) {
    message.error('获取博客信息失败！')
    router.push('/404')
    return
  }
  Object.keys(blogInfo).forEach((k) => {
    // @ts-ignore
    c[k] ? (blogInfo[k] = c[k]) : null
  })
  editor.value.content = blogInfo.body
  title.value = blogInfo.title

  // Get author's information
  userInfo['uid'] = blogInfo.author
  const u = await UsersInfoAPI([blogInfo.author])
  if (!u) return
  Object.keys(userInfo).forEach((k) => {
    // @ts-ignore
    u[blogInfo.author][k] ? (userInfo[k] = u[blogInfo.author][k]) : null
  })

  // Recode read action
  ReadBlogAPI(bid, store.getters['signin/id'])

  // return if user is not signed in
  if (!store.getters['signin/on']) return

  // Get interaction between user and blog
  const ia = await GetBUInteractionAPI(bid)
  if (!ia) return
  if (ia?.islike) actState.like = true
  if (ia?.stars.length) actState.star = true

  // Get interaction of relation between user and author
  const ua = await GetRelationInteractionAPI([blogInfo.author])
  if (!ua) return
  if (ua[blogInfo.author]?.isfollow) actState.follow = true
}

const likeBlog = async function () {
  if (!store.getters['signin/on']) {
    message.warning('访客请先登录！')
    return
  }
  let s = !actState.like
  actState.like = undefined
  const r = await LikeBlogAPI(bid, s)
  if (!r) {
    actState.like = false
    message.warning('操作失败！')
    return
  } else {
    actState.like = s
    blogInfo.likecount += s ? 1 : -1
  }
}
const starBlog = async function () {
  if (!store.getters['signin/on']) {
    message.warning('访客请先登录！')
    return
  }
  let s = !actState.star
  actState.star = undefined
  let r
  if (s) r = await StarBlogAPI(bid)
  else r = await UnstarBlogAPI(bid)
  if (!r) {
    actState.star = false
    message.warning('操作失败！')
    return
  } else {
    actState.star = s
    blogInfo.starcount += s ? 1 : -1
  }
}
const followAuthor = async function () {
  if (!store.getters['signin/on']) {
    message.warning('访客请先登录！')
    return
  }
  let s = !actState.follow
  actState.follow = undefined
  let r
  if (s) r = await FollowUserAPI([blogInfo.author])
  else r = await UnfollowUserAPI([blogInfo.author])
  if (!r) {
    actState.follow = false
    message.warning('操作失败！')
    return
  } else {
    actState.follow = s
  }
}

const scrollTop = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useTitle(title)
useHeaderMode(ModeHeaderPageI.SCROLL)

onMounted(async () => {
  await getInfo()
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
    padding: 2rem 5rem 5rem 0;
  }
  &-left,
  &-right {
    margin: 2rem 1rem;
    width: 20rem;
    height: 20rem;
    // border: 1px solid red;
  }

  &-left {
    position: relative;
  }

  &-text {
    padding: 1rem;

    &-title {
      font-size: 2rem;
      color: var(--colorText);
      margin-bottom: 1rem
      // text-align: center;
    }

    &-info {
      display: flex;
      justify-content: space-between;
    }

    &-cc {
      margin: .4rem 0;
      color: var(--colorTextTertiary);
    }

    &-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: .6rem;
    }
  }
  &-user {
    &-ctl {
      display: flex;
      justify-content: space-around;
      padding-right: 5rem;

      .btn {
        border: none;
      }
    }
  }

  &-interact {
    display: flex;
    position: fixed;
    bottom: 2rem;
    width: inherit;

    .interact-btn {
      margin: 1rem;
      margin-bottom: 0;
      font-size: 1.5rem;
      line-height: 1.5rem;
    }

    p {
      text-align: center;
      padding-right: .1rem;
      color: var(--colorTextTertiary);
      user-select: none;
    }
  }

  &-func {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;

    .btn {
      margin: 1rem;
      font-size: 1.5rem;
      line-height: 1.5rem;
    }
  }
}
</style>
