<template>
  <div id="selfp">
    <!-- Handle -->
    <a-badge
      :count="messageSumCount"
      :offset="[-4, 4]"
      :overflow-count="99"
    >
      <a-avatar
        id="selfp-head"
        :size="headImgSize"
        @click="openSelfpc"
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
        <div id="selfp-ctl-info">
          <p id="selfp-ctl-info-name">
            {{ userInfo?.user ?? '请登录' }}
          </p>
          <p>
            <a-tag
              style="border: none;"
              color="#fa8c16"
            >{{ userInfo.level }}</a-tag>
            <a-divider
              type="vertical"
              style="margin: 0 4px"
            ></a-divider>
            <span id="selfp-ctl-info-exp">
              Exp:
              <span :title="userInfo.exp.toString()">
                {{ userInfo.exp ?? 999 }}
              </span>
            </span>
          </p>
          <p>
            <a-tag style="border: none;">无头衔</a-tag>
          </p>
          <p id="selfp-ctl-info-local">
            <EnvironmentOutlined />
            {{ userInfo.local || '未知' }}
          </p>
        </div>
        <a-avatar id="selfp-ctl-img">
          {{ userInfo.userF }}
        </a-avatar>

        <a-divider class="selfp-ctl-fun"></a-divider>
        <!-- Function -->
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <MessageTwoTone two-tone-color="#73d13d" />
          消息
          <a-badge
            :count="messageCount"
            :offset="[12, -5]"
          >
          </a-badge>
        </a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <FileTwoTone two-tone-color="#4096ff" />
          文章管理
        </a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <StarTwoTone two-tone-color="#f759ab" />
          我的收藏
        </a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <ContactsTwoTone two-tone-color="#36cfc9" />
          个人中心
        </a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <SettingTwoTone two-tone-color="#ffc53d" />
          设置
        </a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <BulbTwoTone two-tone-color="#9254de" />
          反馈 & 建议
        </a-button>

        <a-divider
          class="selfp-ctl-fun"
          style="grid-row: -3 / -2;"
        ></a-divider>
        <!-- Logout -->
        <a-button
          danger
          type="primary"
          class="selfp-ctl-fun"
          style="grid-row: -2 / -1;"
          @click="logout"
        >
          <ImportOutlined />
          退出登录
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { message } from 'ant-design-vue'
import {
  MessageTwoTone, FileTwoTone,
  StarTwoTone, ContactsTwoTone,
  SettingTwoTone, ImportOutlined,
  BulbTwoTone, EnvironmentOutlined,
} from '@ant-design/icons-vue';

import { getUserLevelName } from '../../types/level.user.type'

const store = useStore()


// head-img size
const headImgSize: number =
  parseInt(
    window.getComputedStyle(document.body).getPropertyValue('--headerHeight').slice(0, -2)
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
  level: '访客',
  exp: 0,
  ranks: [],
  local: '未知'
})
const setUserInfo = function (v: any) {
  v.user ? userInfo.user = v.user : null
  v.level ? userInfo.level = getUserLevelName(v.level) : null
  v.exp ? userInfo.exp = v.exp : null
  v.ranks ? userInfo.ranks = v.ranks : null
  v.local ? userInfo.local = v.local : null

  userInfo.userF = /[\u4e00-\u9fa5]/.test(userInfo.user[0]) ?
    userInfo.user[0] : userInfo.user.substring(0, 2)
}
setUserInfo(store.getters['signin/info'])
watch(computed(() => {
  return store.getters['signin/info']
}), (v) => {
  setUserInfo(v)
})

/**
 * HOOK
 */
onMounted(() => {
})
</script>

<style scoped lang="less">
#selfp {
  position: sticky;
  top: 0;

  &-head {
    margin-bottom: 4px;
    cursor: pointer;
  }

  &-ctl {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 50px);
    grid-template-rows: repeat(auto-fill, 50px);

    &-info {
      grid-column: 4 / 7;
      grid-row: 1 / 3;
      margin-top: -1rem;
      margin-left: -20px;
      font-size: 1rem;
      color: var(--colorTextBase);

      >p {
        margin-top: .5rem;
      }

      &-name {
        font-size: 1.4rem !important;
      }

      &-exp {
        font-size: .8rem;
        display: inline-block;
        width: 6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &-local {
        color: var(--colorText);
        font-size: .8rem !important;
      }
    }

    &-img {
      grid-column: 1 / 3;
      grid-row: 1 / 3;

      width: 100%;
      height: 100%;

      font-size: 3rem;
      line-height: 100px;
      cursor: pointer;
    }

    .selfp-ctl-fun {
      grid-column: 1 / fill;
      font-size: 1.1rem;
      line-height: 1.1rem;
      padding-left: 1rem;
      height: 100%;
      text-align: left;

      user-select: none;
      cursor: pointer;

      >.anticon {
        margin-right: 1.1rem;
      }

      &:last-child {
        text-align: center;

        >.anticon {
          margin-right: 0 !important;
        }
      }
    }
  }
}
</style>