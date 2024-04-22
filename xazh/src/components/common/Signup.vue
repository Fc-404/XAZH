<template>
  <div
    id="signup"
    :style="{ width: props.tip ? '46rem' : '22rem', ...props.mStyle }"
  >
    <div
      id="signup-tip"
      v-if="props.tip"
      :style="props.tipStyle"
    >
      <div id="signup-tip-text">
        <p v-html="tipData.content"></p>
        <a-divider
          orientation="right"
          style="border-color: #dcdcdc; color: #dcdcdc;"
        ><span v-html="tipData.footer"></span></a-divider>
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
        <span>夏至星球</span>
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
        >{{ usernameF }}</a-avatar>
      </div>

      <!-- User Input -->
      <div id="signup-panel-user">
        <a-input
          v-model:value="username"
          :status="validUser === false ? 'error' : undefined"
          :placeholder="'用户名' + (!isSignup ? '/邮箱' : '')"
          @change="checkUserValid"
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
        <a-input
          v-model:value="userpswd"
          :status="validPswd === false ? 'error' : undefined"
          type="password"
          placeholder="密码"
          @blur="checkUserPswd"
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
          @change="checkUserPswdR"
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
          v-model:value="usermail"
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
          <a-input
            v-model:value="usermailC"
            placeholder="验证码"
            :maxlength="6"
          >
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
        style="font-size: .7rem; color: var(--colorTextTertiary);"
      >
        其他方式登录
      </a-divider>
      <div
        id="signup-panel-other"
        v-show="!isSignup"
      >
        <a-popover trigger="click">
          <template #content>
            <FnNotice :size="2"></FnNotice>
          </template>

          <qq-outlined class="signup-other" />
          <a-divider type="vertical" />

          <wechat-outlined class="signup-other" />
          <a-divider type="vertical" />

          <github-outlined class="signup-other" />

        </a-popover>
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
          @click="submitEvent"
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
import { Md5 } from 'ts-md5'
import { checkMail, checkPswdLen, formatPswd, formatUser } from "../../util/formCheck.tool";
import { message } from "ant-design-vue";
import { debounceByName } from "../../util/debounce.tool";
import { base64WithDate, debase64WithDate } from "../../util/encodeMsg.tool";
import {
  SendMailValidCodeAPI, UserExistAPI,
  UserSignupAPI, UserSigninAPI
} from "../../api/base.user.api";

const props = defineProps({
  type: { type: String, default: 'signin' },
  tip: { type: Boolean, default: true },
  panelStyle: { type: Object, default: { background: 'var(--colorBgLayout)' } },
  tipStyle: { type: Object },
  mStyle: { type: Object }
})

const emit = defineEmits(['signinSuccess'])
const store = useStore()

const isSignup = ref<boolean>(!!(props.type == 'signup'))
const platform = ref<string>()
const username = ref<string>()
const usernameF = ref<string>()
const userpswd = ref<string>()
const userpswdR = ref<string>()
const usermail = ref<string>()
const usermailC = ref<string>()

const validUser = ref<boolean | undefined | null>(undefined)
const validPswd = ref<boolean | undefined>(undefined)
const validPswdR = ref<boolean | undefined>(undefined)
const validMail = ref<boolean | undefined>(undefined)
const agreeProtlcal = ref<boolean>(false)
const submitEvent = ref(isSignup.value ? signupSubmit : signinSubmit)
const invalidSubmit = ref<boolean | undefined>(false)

const tipData = reactive({
  content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。<br>夕阳西下，断肠人在天涯。',
  footer: '天净沙·秋思'
})


platform.value = store.getters["config/platform"]

/**
 * Send verifition code of mail
 */
const verifyMailBtnData = reactive({
  loading: false,
  disabled: false,
  text: '验证',
  timeCount: 60,
  timer: ref<NodeJS.Timeout>()
})
const sendVerificationCode = function () {
  if (!validMail.value) {
    message.error('请正确输入邮箱！')
    return
  }

  verifyMailBtnData.loading = true

  SendMailValidCodeAPI(usermail.value as string)
    .then(r => {
      if (!r) {
        message.error('验证码发送失败！')
      }
    })

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
const signUpOrIn = function (
  e: MouseEvent | undefined | null,
  type: boolean = true
): void {
  e;
  if (type) {
    isSignup.value = true
    submitEvent.value = signupSubmit
  } else {
    isSignup.value = false
    submitEvent.value = signinSubmit
  }


  username.value = ''
  userpswd.value = ''
  validPswd.value = undefined
  validPswdR.value = undefined
  validUser.value = undefined
}

/**
 * Check user input
 */
watch(username, (v: any) => {
  if (!isSignup.value)
    return

  username.value = formatUser(v || '')
  usernameF.value = /[\u4e00-\u9fa5]/.test(username.value[0]) ?
    username.value[0] : username.value.substring(0, 2)
})
watch(userpswd, (v: any) => {
  userpswd.value = formatPswd(v || '')
  userpswdR.value = ''
})
watch(usermail, (v: any) => {
  !v ? (
    validMail.value = undefined
  ) : (
    checkMail(v) ? validMail.value = true : validMail.value = false
  )
})
const checkUserPswd = function () {
  if (isSignup.value) {
    let code = checkPswdLen(userpswd.value || '')
    if (code == -1) {
      message.error('密码必须大于等于6位！')
      validPswd.value = false
    } else if (code == 0) {
      validPswd.value = true
    } else if (code == 1) {
      message.error('密码必须小于等于16位！')
      validPswd.value = false
    }
  } else
    validPswdR.value = undefined
}
const checkUserPswdR = function () {
  if (validPswd.value != true)
    return
  if (userpswd.value == userpswdR.value) {
    validPswdR.value = true
  } else {
    validPswdR.value = false
  }
}

/**
 * Check valid for username at signup.
 */
const checkUserValid = function () {
  if (isSignup.value) {
    validUser.value = null
    debounceByName('/CheckUserValid', () => {
      UserExistAPI(username.value || '夏至')
        .then((r) => {
          if (r) {
            validUser.value = false
          } else {
            validUser.value = true
          }
        })
    }, 1000)
  } else
    validUser.value = undefined
}

/**
 * Signup and Signin
 */
function signupSubmit() {
  if (!agreeProtlcal.value) {
    message.warn('请先阅读并同意用户协议！')
    return
  }

  if (!!!(validUser.value && validPswd.value && validPswdR.value
    && validMail.value && usermailC.value)) {
    message.error('请正确填写信息！')
    return
  }

  const pswdToken = base64WithDate(userpswd.value!)
  const userInfo = {
    date: pswdToken.date,
    user: username.value,
    pswd: pswdToken.data,
    mail: usermail.value,
    code: usermailC.value
  }

  invalidSubmit.value = true
  UserSignupAPI(userInfo)
    .then(r => {
      switch (r.code) {
        case -1:
          message.error('注册失败！')
          break
        case 0:
          message.success('注册成功！')
          signUpOrIn(null, false)
          break
        case 1:
          message.error('邮箱验证码错误！')
          break
        case 2:
          message.error('邮箱已被注册！')
          break
      }
    })
    .finally(() => {
      invalidSubmit.value = false
    })

}
function signinSubmit() {
  if (!agreeProtlcal.value) {
    message.warn('请先阅读并同意用户协议！')
    return
  }

  if (!username.value) {
    message.warn('请输入用户名！')
    return
  } else if (!userpswd.value) {
    message.warn('请输入用户密码！')
    return
  }

  const userInfo = {
    account: username.value,
    pswd: Md5.hashStr(username.value! + userpswd.value! + username.value!)
  }

  invalidSubmit.value = true
  UserSigninAPI(userInfo)
    .then(r => {
      switch (r.code) {
        case 0:
          message.success('登录成功！')
          // Decode the Token
          const token = debase64WithDate({
            date: r.body.date, data: r.body.token
          }) || 'aW52YWxpZA=='

          store.commit('signin/signin', {
            id: r.body.id,
            token: token,
          })

          emit('signinSuccess')
          break
        case 1:
          message.error('账号不存在！')
          break
        case 2:
          message.error('密码错误！')
      }
    })
    .finally(() => {
      invalidSubmit.value = false
    })
}

/**
 * HOOK
 */
onMounted(() => {
})
</script>

<style scoped lang="less">
#signup {
  border-radius: 1.2rem;
  margin: 0 auto;
  height: 28rem;
  overflow: hidden;
  background-image: url(/img/bg.jpg);
  background-size: cover;
  background-position: center;

  &-tip,
  &-panel {
    height: 28rem;
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
    width: 22rem;
    backdrop-filter: blur(2rem) saturate(180%);

    &-head {
      margin-top: 1rem;

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
        font-size: .8rem;
        color: var(--colorTextSecondary);

        >span {
          color: var(--colorPrimary);
          cursor: pointer;
        }
      }
    }

    &-himg {
      padding: 0 3rem;
      margin-top: 2.2rem;

      >div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5.4rem;

        >p:nth-child(1) {
          font-size: 1.6rem;
          color: var(--colorPrimary);
          font-weight: bolder;
        }

        >p:nth-child(2) {
          font-size: .8rem;
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
        font-size: .7rem;
        line-height: 1.1rem;
        color: var(--colorTextSecondary);
        vertical-align: bottom;
      }
    }

    &-forget {
      margin-right: 3rem;
      font-size: .7rem;
      text-align: right;
      cursor: pointer;
    }

    &-mail-verify {
      width: 7.2rem !important;
      margin-left: 8.8rem;
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
}
</style>