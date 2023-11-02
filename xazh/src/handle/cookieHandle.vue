<!-- Configure Cookie -->

<script setup lang="ts">
import { useStore } from 'vuex'
import cookie from 'js-cookie'
import axios from 'axios'
import { Modal, message } from 'ant-design-vue'

import { base64WithDate } from '../util/encodeMsg.tool'
import { AxiosErrorCatch } from '../util/error.axios.tool'

const store = useStore()

/**
 * Signin test with token
 */
const testTokenValidity = async function () {
  const user = cookie.get('user') || null
  const token = cookie.get('token') || null
  if (!token || !user) {
    message.info('Not signin token.')
    store.commit('signin/logout')
    // TODO
    return
  }

  const param = base64WithDate(token)

  // test token
  await axios.post('/User/VerifyToken', {
    date: param.date,
    user: user,
    token: param.data
  })
    .then((r) => {
      if (r.data.code == 0) {
        store.commit('signin/signin', token)
      } else {
        message.warn('登录失效！')
        store.commit('signin/logout')
      }
    })
    .catch(AxiosErrorCatch)
}

/**
 * Sync the PConf
 */
const syncPconf = async function () {
  let pconf: any = cookie.get('pconf')
  try {
    pconf = JSON.parse(pconf as string)
  } catch {
    pconf = {
      version: 'undefined'
    }
  }

  axios.post('/User/Config/PConf/Sync', {
    ...store.getters['signin/requireParam'],
    version: pconf.version
  })
    .then((r) => {
      switch (r.data.code) {
        case 0:
          // The cookie of pconf is consistent.
          break
        case 1:
          // cookie.set('pconf', JSON.stringify(r.data.body))
          choosePConf(r.data.body, pconf)
          break
        case -1:
          // No pconf on the server.
          if (pconf.version) {
            uploadPConf(pconf)
          }
          break
      }
    })
    .catch(AxiosErrorCatch)

  const choosePConf = function (server: any, client: any) {
    const serverDate = new Date(server.date)
    const clientDate = new Date(client.date)

    Modal.confirm({
      title: '提示',
      content: h('div', [
        h('p', '您的个人配置和云端不一致！'),
        h('p', `云端保存时间：
          ${serverDate.getFullYear()}/${serverDate.getMonth()}/${serverDate.getDate()} 
          ${serverDate.getHours()}:${serverDate.getMinutes()}
        `),
        h('p', `本地保存时间：
          ${clientDate.getFullYear()}/${clientDate.getMonth()}/${clientDate.getDate()} 
          ${clientDate.getHours()}:${clientDate.getMinutes()}
        `)
      ]),
      cancelText: '使用本地配置',
      okText: '同步云端配置',
      onOk: async () => {
        store.commit('pconf/set', server)
      },
    })
  }

  const uploadPConf = function(client: any) {
    const {version, date, stylePrimaryColor, ...pconf} = client

    axios.post('/User/Config/PConf/Upload', {
      version: version,
      ...store.getters['signin/requireParam'],
      ...pconf
    })
    .catch(AxiosErrorCatch)
  }
}

/**
 * HOOK
 */
onMounted(async () => {
  await testTokenValidity()
  syncPconf()
})
</script>
<template>
  <div>

  </div>
</template>

<style scoped></style>../util/encodeMsg.tool../util/error.axios.tool