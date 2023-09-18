<template>
  <div id="selfp">
    <!-- Handle -->
    <a-avatar
      id="selfp-head"
      :size="headImgSize"
      @click="openSelfpc"
    ></a-avatar>

    <!-- Panel -->
    <a-drawer
      v-model:open="selfpcOpen"
      :closable="false"
      :width="348"
    >
      <div id="selfp-ctl">
        <div id="selfp-ctl-info">
          <p>User</p>
          <p>Exp | Level</p>
          <p>
            <a-tag style="border: none;">无头衔</a-tag>
          </p>
          <p>
            <EnvironmentOutlined />
            local
          </p>
        </div>
        <a-avatar id="selfp-ctl-img"></a-avatar>

        <a-divider class="selfp-ctl-fun"></a-divider>
        <!-- Function -->
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >
          <MessageTwoTone two-tone-color="#73d13d" />
          消息
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

const store = useStore()

// head-img size
const headImgSize: number =
  parseInt(
    window.getComputedStyle(document.body).getPropertyValue('--headerHeight').slice(0, -2)
  ) * 0.66

const selfpcOpen = ref<boolean>(true)
// open self-panel
const openSelfpc = function () {
  selfpcOpen.value = !selfpcOpen.value
}

// Logout
const logout = function () {
  store.commit('signin/isSignin', false)
  message.success('账号已退出！')
}
</script>

<style scoped lang="less">
#selfp {
  position: sticky;
  top: 0;

  &-head {
    margin-bottom: 4px;
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
    }

    &-img {
      grid-column: 1 / 3;
      grid-row: 1 / 3;

      width: 100%;
      height: 100%;
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