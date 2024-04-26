<template>
  <div id="selfp">
    <!-- Handle -->
    <a-badge :count="messageSumCount" :offset="[-4, 4]" :overflow-count="99">
      <a-avatar
        id="selfp-head"
        :size="headImgSize"
        @click="openSelfpc"
        :src="userInfo.userHimg"
        >{{ userInfo.userF }}
      </a-avatar>
    </a-badge>

    <!-- Panel -->
    <a-drawer
      v-model:open="selfpcOpen"
      :closable="false"
      :width="348"
      :rootStyle="{ maxHeight: '100vh' }"
    >
      <div id="selfp-ctl">
        <UserInfoCard
          id="selfp-ctl-info"
          :style="{ margin: 0 }"
          :info="store.getters['signin/info']"
        ></UserInfoCard>

        <a-divider></a-divider>
        <!-- Function -->
        <div id="selfp-ctl-fun">
          <a-button type="text" class="selfp-ctl-fun">
            <MessageTwoTone two-tone-color="#73d13d" />
            消息
            <a-badge :count="messageCount" :offset="[12, -5]"> </a-badge>
          </a-button>
          <a-button type="text" class="selfp-ctl-fun">
            <FileTwoTone two-tone-color="#4096ff" />
            文章管理
          </a-button>
          <a-button type="text" class="selfp-ctl-fun">
            <StarTwoTone two-tone-color="#f759ab" />
            我的收藏
          </a-button>
          <a-button type="text" class="selfp-ctl-fun">
            <IdcardTwoTone two-tone-color="#36cfc9" />
            个人中心
          </a-button>
          <a-button type="text" class="selfp-ctl-fun">
            <SettingTwoTone two-tone-color="#ffc53d" />
            设置
          </a-button>
          <a-button type="text" class="selfp-ctl-fun">
            <BulbTwoTone two-tone-color="#9254de" />
            反馈 & 建议
          </a-button>
        </div>
        <div style="height: 7rem"></div>

        <div id="selfp-ctl-bottom">
          <div v-if="userInfo.level >= 2">
            <a-button
              type="text"
              class="selfp-ctl-fun"
              @click="toRouter('WEBPanel')"
            >
              <FundTwoTone two-tone-color="#2f54eb" />
              网站面板
            </a-button>
            <a-button type="text" class="selfp-ctl-fun">
              <ControlTwoTone two-tone-color="#fa541c" />
              管理员面板
            </a-button>
          </div>
          <a-divider style="margin-top: 0"></a-divider>
          <!-- Logout -->
          <a-button
            id="selfp-ctl-bottom-exit"
            danger
            type="primary"
            @click="logout"
          >
            <ImportOutlined />
            退出登录
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import {
  MessageTwoTone,
  FileTwoTone,
  StarTwoTone,
  IdcardTwoTone,
  SettingTwoTone,
  ImportOutlined,
  BulbTwoTone,
  ControlTwoTone,
  FundTwoTone,
} from '@ant-design/icons-vue'

import { useRouter } from 'vue-router'
import { user2ImgText } from '../../util/str.tool'
import UserInfoCard from './UserInfoCard.vue'

const store = useStore()

// head-img size
const headImgSize: number =
  parseInt(
    window
      .getComputedStyle(document.body)
      .getPropertyValue('--headerHeight')
      .slice(0, -2)
  ) * 0.66

const selfpcOpen = ref<boolean>(false)
// open self-panel
const openSelfpc = function () {
  selfpcOpen.value = !selfpcOpen.value
}

// Logout
const logout = function () {
  store.commit('signin/logout')
  message.success('账号已退出！')
}

/**
 * Message System.
 */
const messageCount = ref(0)
const messageSumCount = computed(() => {
  return messageCount.value
})

/**
 * Get User Info
 */
const userInfo = reactive({
  user: '未登录',
  userF: '',
  userHimg: '',
  level: 0,
  exp: 0,
  ranks: [],
  local: '未知',
})
const setUserInfo = function (v: any) {
  v.user ? (userInfo.user = v.user) : null
  v.himg ? (userInfo.userHimg = v.himg) : null
  v.level ? (userInfo.level = v.level) : null
  v.exp ? (userInfo.exp = v.exp) : null
  v.ranks ? (userInfo.ranks = v.ranks) : null
  v.local ? (userInfo.local = v.local) : null

  userInfo.userF = user2ImgText(userInfo.user)
  userInfo.userHimg = store.getters['config/fileUrl'](userInfo.userHimg)
}
setUserInfo(store.getters['signin/info'])
watch(
  computed(() => {
    return store.getters['signin/info']
  }),
  (v) => {
    setUserInfo(v)
  }
)

/**
 * Go to router.
 */
const router = useRouter()
const toRouter = function (name: string) {
  router.push({
    name: name,
  })
  selfpcOpen.value = false
}

/**
 * HOOK
 */
onMounted(() => {})
</script>

<style scoped lang="less">
#selfp {
  position: sticky;
  top: 0;

  &-head {
    margin-bottom: 4px;
    cursor: pointer;
    border: none;
  }

  &-ctl {
    width: 100%;
    height: 100%;

    .selfp-ctl-fun {
      width: 100%;
      height: 3rem;
      font-size: 1.1rem;
      line-height: 1.1rem;
      padding-left: 1rem;
      text-align: left;

      user-select: none;
      cursor: pointer;

      > .anticon {
        margin-right: 1.1rem;
      }
    }

    &-bottom {
      position: absolute;
      bottom: 0;
      width: calc(100% - 3rem);
      padding-bottom: 2rem;

      &-exit {
        width: 100%;
        font-size: 1.1rem;
        height: 2.7rem;
        text-align: center;
      }
    }
  }
}
</style>
