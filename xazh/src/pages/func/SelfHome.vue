<template>
  <div id="selfhome">
    <a-alert
      v-if="userInfo.deleted"
      message="该用户已注销"
      type="error"
      class="alert"
      show-icon
    />
    <a-alert
      v-if="userInfo.disabled"
      message="该用户已封禁"
      type="warning"
      class="alert"
      show-icon
    />

    <div id="selfhome-">
      <div id="selfhome-info">
        <div style="display: flex; justify-content: center">
          <a-avatar
            id="selfhome-info-img"
            :style="{
              backgroundColor: user2ImgColor(userInfo.user),
              cursor: 'pointer',
            }"
            :src="store.getters['config/fileUrl'](userInfo.himg)"
            @click="previewHimg = true"
          >
            {{ user2ImgText(userInfo.user) }}
          </a-avatar>
          <a-image
            :style="{ display: 'none' }"
            :preview="{
              visible: previewHimg,
              onVisibleChange: (v) => (previewHimg = v),
            }"
            :src="store.getters['config/fileUrl'](userInfo.himg)"
          />
        </div>
        <p id="selfhome-info-aboutme">{{ userInfo.about_me }}</p>
        <div id="selfhome-info-table">
          <table>
            <tr>
              <td>点赞量</td>
              <td>{{ userBlogInfo.likecount }}</td>
              <td>阅读量</td>
              <td>{{ userBlogInfo.readcount }}</td>
            </tr>
            <tr>
              <td>收藏量</td>
              <td>{{ userBlogInfo.starcount }}</td>
              <td>总博客</td>
              <td>{{ userBlogInfo.blogcount }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <td>ID</td>
              <td>{{ uid }}</td>
            </tr>
            <tr>
              <td>用户名</td>
              <td>{{ userInfo.user }}</td>
            </tr>
            <a-divider></a-divider>
            <tr>
              <td>经验</td>
              <td>{{ userInfo.exp }}</td>
            </tr>
            <tr>
              <td>级别</td>
              <td>{{ getUserLevelName(userInfo.level) }}</td>
            </tr>
            <tr>
              <td>头衔</td>
              <td>
                <span v-for="i in userInfo.ranks" :key="i">{{ i }} , </span>
              </td>
            </tr>
            <a-divider></a-divider>
            <tr>
              <td>注册时间</td>
              <td>
                {{ formatDate('YYYY-MM-DD', new Date(userInfo.signup_date)) }}
              </td>
            </tr>
            <tr>
              <td>归属地</td>
              <td>{{ userInfo.belong_place }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div id="selfhome-page">
        <a-tabs v-model:activeKey="tag">
          <a-tab-pane :key="TAG.blog">
            <template #tab>
              <FileOutlined /> {{ isSelf ? '文章管理' : '文章' }}
            </template>
            <BlogViewList
              v-for="i in userBlogInfo.value"
              :bid="i.value"
              :ctl="true"
            >
            </BlogViewList>
          </a-tab-pane>
          <a-tab-pane v-if="isSelf" :key="TAG.rel">
            <template #tab> <UserOutlined /> 好友管理 </template>
            <FnNotice :size="5"></FnNotice>
          </a-tab-pane>
          <a-tab-pane :key="TAG.star">
            <template #tab>
              <StarOutlined /> {{ isSelf ? '我的收藏' : '收藏' }}
            </template>
            star
          </a-tab-pane>
          <a-tab-pane :key="TAG.liked">
            <template #tab> <LikeOutlined /> 最近点赞 </template>
            <FnNotice :size="5"></FnNotice>
          </a-tab-pane>
          <a-tab-pane :key="TAG.readed">
            <template #tab> <EyeOutlined /> 浏览历史 </template>
            <FnNotice :size="5"></FnNotice>
          </a-tab-pane>
          <a-tab-pane v-if="isSelf" :key="TAG.edit">
            <template #tab> <EditOutlined /> 编辑资料 </template>
            <EditUserInfo :userInfo="userInfo"></EditUserInfo>
          </a-tab-pane>
          <a-tab-pane v-if="isSelf" :key="TAG.setting">
            <template #tab> <SettingOutlined /> 设置 </template>
            <FnNotice :size="5"></FnNotice>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { UsersInfoAPI } from '../../api/base.user.api'
import { useStore } from 'vuex'
import { user2ImgColor, user2ImgText } from '../../util/str.tool'
import { getUserLevelName } from '../../types/level.user.type'
import { formatDate } from '../../util/formatDate.tool'
import {
  FileOutlined,
  StarOutlined,
  LikeOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { useTitle } from '../../composables/useTitle'
import { useHeaderMode } from '../../composables/useHeaderMode'
import { ModeHeaderPageI } from '../../interface/page.i'
import BlogViewList from '../../components/common/BlogViewList.vue'
import { GetUserBlogInfoAPI } from '../../api/blog.api'
import EditUserInfo from '../userhome/editUserInfo.vue'

const route = useRoute()
const store = useStore()
let uid: string = route.params['uid']?.toString()
let pos: string = route.params['pos']?.toString()
const isSelf = ref<boolean>(store.getters['signin/id'] == uid)

enum TAG {
  blog = 'blog',
  rel = 'rel',
  star = 'star',
  liked = 'liked',
  readed = 'readed',
  edit = 'edit',
  setting = 'setting',
}
//@ts-ignore
const tag = ref<TAG>(TAG[pos] ?? TAG.blog)
watch(
  () => route.params['pos'],
  (v) => {
    //@ts-ignore
    tag.value = TAG[v]
  }
)
watch(
  () => route.params['uid'],
  (v) => {
    uid = v as string
    userBlogInfo.value = Array<any>()
    isSelf.value = !!(store.getters['signin/id'] == uid)
    getUserInfo()
    getUserBlogInfo()
  }
)

const userInfo = reactive({
  _id: '',
  himg: '',
  user: '',
  exp: 0,
  level: 0,
  ranks: '',
  about_me: '',
  signup_date: '',
  belong_place: '',
  disabled: false,
  deleted: false,
})
const previewHimg = ref<boolean>(false)

const userBlogInfo = reactive({
  readcount: 0,
  likecount: 0,
  starcount: 0,
  blogcount: 0,
  value: Array<any>(),
  next: '',
})

const getUserInfo = async function () {
  const u = await UsersInfoAPI([uid])
  if (!u) return
  Object.keys(userInfo).forEach((k) => {
    // @ts-ignore
    u[uid][k] ? (userInfo[k] = u[uid][k]) : null
  })

  title.value = userInfo.user + title.value
}

const getUserBlogInfo = async function (chunk?: string) {
  const ub = await GetUserBlogInfoAPI(uid, chunk)
  if (!ub) return
  ub.readcount ? (userBlogInfo.readcount = ub.readcount) : null
  ub.likecount ? (userBlogInfo.likecount = ub.likecount) : null
  ub.starcount ? (userBlogInfo.starcount = ub.starcount) : null
  ub.blogcount ? (userBlogInfo.blogcount = ub.blogcount) : null
  ub.next ? (userBlogInfo.next = ub.next) : null
  ub.value.forEach((i: string) => {
    userBlogInfo.value.push({
      chunk: ub.node,
      value: i,
    })
  })
  console.log(userBlogInfo)
}

const title = ref<string>(' - 个人中心')
useTitle(title)
useHeaderMode(ModeHeaderPageI.NONE)
onMounted(async () => {
  await getUserInfo()
  await getUserBlogInfo()
})
</script>

<style scoped lang="less">
#selfhome {
  padding-top: 3rem;

  .alert {
    width: 64rem;
    margin: 0 auto 2rem auto;
  }

  &- {
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    position: relative;

    &info {
      width: 20rem;
      margin-bottom: 12rem;

      &-img {
        border: none;
        width: 12rem;
        height: 12rem;
        font-size: 7rem;
        line-height: 11rem;
      }

      &-aboutme {
        text-align: center;
        margin-top: 1rem;
        padding: 1rem;
        line-height: 1.5rem;
        color: var(--colorTextSecondary);
      }

      &-table {
        table {
          background-color: var(--colorBgContainer);
          border-radius: calc(var(--borderRadius) * 2);
          box-shadow: var(--boxShadow);
          padding: 1.5rem;
          width: 20rem;

          margin: 1rem auto auto auto;
          color: var(--colorTextSecondary);

          > tr td:nth-child(odd) {
            text-align: right;
            font-weight: bolder;
            padding-top: 1rem;
            user-select: none;
          }
          > tr td:nth-child(even) {
            padding-left: 1.5rem;
            padding-top: 1rem;
          }
        }
      }
    }

    &page {
      width: 50%;
      min-width: 54rem;
      max-width: 64rem;
      margin: 0 3rem;
    }
  }
}
</style>
