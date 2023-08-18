<template>
  <div
    id="signup"
    :style="{ width: props.tip ? '44rem' : '20rem', ...props.mStyle }"
  >
    <div
      id="signup-tip"
      v-if="props.tip"
      :style="props.tipStyle"
    >
      <div id="signup-tip-text">
        <p>枯藤老树昏鸦，小桥流水人家，古道西风瘦马。<br>夕阳西下，断肠人在天涯。</p>
        <a-divider
          orientation="right"
          style="border-color: #dcdcdc; color: #dcdcdc;"
        >2023年08月18日</a-divider>
      </div>
    </div>
    <div
      id="signup-panel"
      :style="props.panelStyle"
    >
      <!-- Head -->
      <div
        id="signup-panel-head"
        v-show="!isSignup"
      >
        <Logo
          id="signup-panel-head-logo"
          size="50"
          color="var(--colorPrimary)"
        ></Logo>
        <span>夏至 De 主页</span>
        <p>没有账号？去<span @click="signUpOrIn">注册</span></p>
      </div>

      <!-- Head Image -->
      <div
        id="signup-panel-himg"
        v-show="isSignup"
      >
        <div>
          <p>注册账号</p>
          <p>已有账号？去<span @click="signUpOrIn($event, false)">登录</span></p>
        </div>
        <a-avatar
          :size="64"
          style="font-size: 32px;"
        >{{ username }}</a-avatar>
      </div>

      <!-- User Input -->
      <div id="signup-panel-user">
        <a-input
          v-model:value="username"
          :status="validUser === false ? 'error' : undefined"
          :placeholder="'用户名' + (!isSignup ? '/邮箱' : '')"
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
      </div>

      <!-- User Password -->
      <div id="signup-panel-pswd">
        <a-tooltip
          title="6-16位字符 A-Z a-z 0-9 $ @ * _ & | !"
          :open="isSignup ? undefined : false"
        >
          <a-input
            v-model:value="userpswd"
            :status="validPswd === false ? 'error' : undefined"
            type="password"
            placeholder="密码"
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

      <!-- Password Repeat -->
      <div
        id="signup-panel-pswd-repeat"
        v-show="isSignup"
      >
        <a-input
          v-model:value="userpswdR"
          :status="validPswdR === false ? 'error' : undefined"
          type="password"
          placeholder="重复密码"
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
      </div>

      <!-- Mail Verify -->
      <div
        id="signup-panel-mail"
        v-show="isSignup"
      >
        <a-input
          :status="validMail === false ? 'error' : undefined"
          placeholder="邮箱"
        >
          <template #prefix>
            <mail-outlined />
            <a-divider type="vertical" />
          </template>
          <template #suffix>
            <a-button
              type="primary"
              ghost
              size="small"
              @click="sendVerificationCode"
              :loading="verifyMailBtnData.loading"
              :disabled="verifyMailBtnData.disabled"
            >{{ verifyMailBtnData.text }}</a-button>
          </template>
        </a-input>
        <div
          id="signup-panel-mail-verify"
          v-show="isSignup"
        >
          <a-input placeholder="验证码">
            <template #addonBefore>
              <span>M -</span>
            </template>
          </a-input>
        </div>
      </div>

      <!-- Forget Password -->
      <div
        id="signup-panel-forget"
        v-show="!isSignup"
      >
        <a>忘记密码？</a>
      </div>

      <!-- Other Signin -->
      <a-divider
        v-show="!isSignup"
        style="font-size: .2rem; color: var(--colorTextTertiary);"
      >
        其他方式登录
      </a-divider>
      <div
        id="signup-panel-other"
        v-show="!isSignup"
      >
        <qq-outlined class="signup-other" />
        <a-divider type="vertical" />
        <wechat-outlined class="signup-other" />
        <a-divider type="vertical" />
        <github-outlined class="signup-other" />
      </div>

      <!-- Protocal -->
      <div id="signup-panel-protocal">
        <a-checkbox
          v-model:checked="agreeProtlcal"
          style="font-size: 1px;"
        />
        <span>同意 <a
            href="/protocal/userUseProtocal.html"
            target="_blank"
          >用户协议</a></span>
      </div>

      <!-- Submit -->
      <div id="signup-panel-submit">
        <a-button
          type="primary"
          :disabled="invalidSubmit"
          :loading="invalidSubmit === undefined"
        >
          {{ isSignup ? '注册' : '登录' }}
        </a-button>
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
  type: { type: String, default: 'signin' },
  tip: { type: Boolean, default: true },
  panelStyle: { type: Object, default: { background: 'var(--colorBgLayout)' } },
  tipStyle: { type: Object },
  mStyle: { type: Object }
})

const store = useStore()

const isSignup = ref<boolean>(!!(props.type == 'signup'))
const platform = ref<string>()
const himg = ref<string>()
const username = ref<string>()
const usernameF = ref<string>()
const userpswd = ref<string>()
const userpswdR = ref<string>()

const validUser = ref<boolean | undefined | null>(undefined)
const validPswd = ref<boolean | undefined>(undefined)
const validPswdR = ref<boolean | undefined>(undefined)
const validMail = ref<boolean | undefined>(undefined)
const agreeProtlcal = ref<boolean>(false)
const invalidSubmit = ref<boolean | undefined>(false)

platform.value = store.getters["config/platform"]

/**
 * TODO: 
 */
const verifyMailBtnData = reactive({
  loading: false,
  disabled: false,
  text: '验证',
  timeCount: 60,
  timer: ref<NodeJS.Timer>()
})
const sendVerificationCode = function () {
  verifyMailBtnData.loading = true

  verifyMailBtnData.timer = setInterval(() => {
    if (verifyMailBtnData.timeCount < 0) {
      verifyMailBtnData.timeCount = 60
      clearInterval(verifyMailBtnData.timer)
      verifyMailBtnData.text = '验证'
      verifyMailBtnData.disabled = false
      return
    }
    verifyMailBtnData.loading = false
    verifyMailBtnData.disabled = true
    verifyMailBtnData.text = verifyMailBtnData.timeCount-- + 's'
  }, 1000)
}

/**
 * To signup
 */
const signUpOrIn = function (e: MouseEvent, type: boolean = true): void {
  e; type ? isSignup.value = true : isSignup.value = false
}

/**
 * HOOK
 */
onMounted(() => {
})
</script>

<style scoped lang="scss">
#signup {
  border-radius: 1.2rem;
  margin: 0 auto;
  height: 26rem;
  overflow: hidden;
  background-image: url(/img/bg.jpg);
  background-size: cover;

  &-tip,
  &-panel {
    height: 26rem;
    display: inline-block;
    vertical-align: top;
  }

  &-tip {
    width: 24rem;
    position: relative;
    color: #dcdcdc;

    &-text {
      padding: 1rem 1.5rem;
      backdrop-filter: blur(64px) saturate(180%);
      position: absolute;
      bottom: 0;
    }
  }

  &-panel {
    position: relative;
    width: 20rem;
    backdrop-filter: blur(1rem) saturate(180%);

    &-head {
      &-logo {
        margin-left: 3rem;
        margin-right: 1.5rem;
        margin-bottom: .5rem;
        vertical-align: middle;
      }

      >span {
        font-size: 1.5rem;
        color: var(--colorPrimary);
        font-weight: bolder;
        line-height: 6rem;
      }

      >p {
        text-align: center;
        font-size: .5rem;
        color: var(--colorTextSecondary);

        >span {
          color: var(--colorPrimary);
          cursor: pointer;
        }
      }
    }

    &-himg {
      padding: 0 3rem;
      margin-top: 1.2rem;

      >div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 3.4rem;

        >p:nth-child(1) {
          font-size: 1.6rem;
          color: var(--colorPrimary);
          font-weight: bolder;
        }

        >p:nth-child(2) {
          font-size: .5rem;
          line-height: 1.8rem;
          color: var(--colorTextSecondary);

          >span {
            color: var(--colorPrimary);
            cursor: pointer;
          }
        }
      }

      >.ant-avatar {
        display: inline-block;
        background-color: var(--colorPrimary);
      }
    }

    &-user,
    &-pswd,
    &-mail,
    &-pswd-repeat {
      margin: 1rem 3rem;
    }

    &-protocal {
      margin-left: 3rem;

      >span {
        margin: 0 .5rem;
        font-size: .5rem;
        color: var(--colorTextSecondary);
      }
    }

    &-forget {
      margin-right: 3rem;
      font-size: .5rem;
      text-align: right;
      cursor: pointer;
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
      margin-bottom: 1rem;

      >.signup-other {
        :hover {
          color: var(--colorPrimaryHover);
        }

        cursor: pointer;
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
}</style>