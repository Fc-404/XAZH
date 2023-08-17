<template>
  <div
    id="signup"
    :style="{ width: props.tip ? '44rem' : '20rem' }"
  >
    <div
      id="signup-tip"
      v-if="props.tip"
    ></div>
    <div id="signup-panel">
      <div id="signup-panel-himg">
        <a-avatar
          :size="64"
          style="font-size: 32px;"
        >{{ username }}</a-avatar>
      </div>
      <div id="signup-panel-user">
        <a-tooltip title="中文不超过8位，英文不超过16位">
          <a-input
            v-model:value="username"
            :status="validUser === false ? 'error' : undefined"
          >
            <template #prefix>
              <user-outlined />
              <a-divider type="vertical" />
            </template>
            <template #suffix>
              <loading-outlined
                style="color: var(--colorPrimary); margin-inline-end: auto;"
                v-show="validUser === null"
              />
              <check-outlined
                style="color: var(--colorSuccess); margin-inline-end: auto;"
                v-show="validUser === true"
              />
              <close-outlined
                style="color: var(--colorError)"
                v-show="validUser === false"
              />
            </template>
          </a-input>
        </a-tooltip>
      </div>
      <div id="signup-panel-pswd">
        <a-tooltip title="6-16位字符 A-Z a-z 0-9 $ @ * _ & | !">
          <a-input
            v-model:value="userpswd"
            :status="validPswd === false ? 'error' : undefined"
            type="password"
          >
            <template #prefix>
              <lock-outlined />
              <a-divider type="vertical" />
            </template>
            <template #suffix>
              <check-outlined
                style="color: var(--colorSuccess); margin-inline-end: auto;"
                v-show="validPswd === true"
              />
              <close-outlined
                style="color: var(--colorError)"
                v-show="validPswd === false"
              />
            </template>
          </a-input>
        </a-tooltip>
      </div>
      <div
        id="signup-panel-pswd-repeat"
        v-show="props.type == 'signup'"
      >
        <a-tooltip title="请重复密码！">
          <a-input
            v-model:value="userpswdR"
            :status="validPswdR === false ? 'error' : undefined"
            type="password"
          >
            <template #prefix>
              <lock-outlined />
              <a-divider type="vertical" />
            </template>
            <template #suffix>
              <check-outlined
                style="color: var(--colorSuccess); margin-inline-end: auto;"
                v-show="validPswdR === true"
              />
              <close-outlined
                style="color: var(--colorError)"
                v-show="validPswdR === false"
              />
            </template>
          </a-input>
        </a-tooltip>
      </div>
      <div id="signup-panel-mail">
        <a-input>
          <template #prefix>
            <mail-outlined />
            <a-divider type="vertical" />
          </template>
          <template #suffix>
            <a-button
              type="primary"
              ghost
              size="small"
            >验证</a-button>
          </template>
        </a-input>
        <div id="signup-panel-mail-verify">
          <a-input>
            <template #addonBefore>
              <span>M -</span>
            </template>
          </a-input>
        </div>
      </div>

      <div id="signup-panel-other">
        <qq-outlined class="signup-other" />
        <a-divider type="vertical" />
        <wechat-outlined class="signup-other" />
        <a-divider type="vertical" />
        <github-outlined class="signup-other" />
      </div>

      <div id="signup-panel-submit">
        <a-button type="primary">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import {
  UserOutlined, LoadingOutlined, CheckOutlined,
  CloseOutlined, LockOutlined, MailOutlined,
  QqOutlined, WechatOutlined, GithubOutlined
} from "@ant-design/icons-vue";

const props = defineProps({
  type: { type: String, default: 'signup' },
  tip: { type: Boolean, default: false }
})

const store = useStore()

const platform = ref<string>()
const himg = ref<string>()
const username = ref<string>()
const usernameF = ref<string>()
const userpswd = ref<string>()
const userpswdR = ref<string>()

const validUser = ref<boolean | undefined | null>(undefined)
const validPswd = ref<boolean | undefined>(undefined)
const validPswdR = ref<boolean | undefined>(undefined)

platform.value = store.getters["config/platform"]

</script>

<style scoped lang="scss">
#signup {
  border-radius: 1.2rem;
  margin: 0 auto;
  // width: 44rem;
  height: 26rem;
  background-color: var(--colorBgLayout);
  overflow: hidden;

  &-tip,
  &-panel {
    height: 26rem;
    display: inline-block;
    vertical-align: top;
  }

  &-tip {
    width: 24rem;
    background-color: red;
  }

  &-panel {
    position: relative;
    width: 20rem;

    &-himg>.ant-avatar {
      display: block;
      margin: 1.2rem auto;
      background-color: var(--colorPrimary);
    }

    &-user,
    &-pswd,
    &-mail,
    &-pswd-repeat {
      margin: 1rem 3rem;
    }

    &-mail-verify {
      width: 7.2rem !important;
      margin-left: 6.8rem;
      margin-top: .2rem;
    }

    &-other {
      display: flex;
      justify-content: center;
      color: var(--colorPrimary);

      >.signup-other {
        :hover {
          color: var(--colorPrimaryHover);
        }
      }
    }

    &-submit {
      >.ant-btn {
        width: 100%;
        height: 3rem;
        border-radius: 0;
        position: absolute;
        bottom: 0;
      }
    }
  }
}
</style>