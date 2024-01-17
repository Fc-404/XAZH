<!-- Signin event register -->

<script setup lang="ts">
import cookie from 'js-cookie'
import { useStore } from 'vuex'
import { AxiosErrorCatch } from '../axios/error.axios';
import { Modal } from 'ant-design-vue';
import { PConfSyncAPI, UploadPConfAPI } from '../api/config.user.api';
import { xazhAxios } from '../axios/xazh.axios';
import { base64WithDate } from '../util/encodeMsg.tool';
import { GetUserInfoAPI } from '../api/base.user.api';


const store = useStore()

/**
 * Configure XAZH Axios.
 */
const configureXazhAxios = async function () {
  xazhAxios.interceptors.request.use((config) => {
    const result = base64WithDate(store.getters['signin/token'])
    config.headers['Custom-ID'] = store.getters['signin/id']
    config.headers['Custom-Token'] = result.data
    config.headers['Custom-Date'] = result.date.toISOString()
    return config
  }, (error) => {
    console.log('XAZH: request error.');
    return Promise.reject(error)
  })
}

/**
 * Get user info
 */
const getUserInfo = async function () {
  // const userInfo
  await GetUserInfoAPI()
    .then((r) => {
      store.commit('signin/info', r.body)
    })
}

/**
 * Sync the PConf
 */
const syncPconf = function () {
  let pconf: any = cookie.get('pconf')
  try {
    pconf = JSON.parse(pconf as string)
  } catch { }

  if (cookie.get('pconf/useLocal') == 'true') {
    store.commit('pconf/set', pconf)
    return
  }

  PConfSyncAPI(pconf?.version)
    .then((r) => {
      switch (r.code) {
        case 0:
          // The cookie of pconf is consistent.
          break
        case 1:
          choosePConf(r.body, pconf)
          break
        case -1:
          // No pconf on the server.
          store.commit('pconf/set', null)
          UploadPConfAPI()
          break
      }
    })
    .catch(AxiosErrorCatch)

  const choosePConf = function (server: any, client: any) {
    const serverDate = new Date(server.date)
    const clientDate = new Date(client?.date)

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
        cookie.remove('pconf/useLocal')

        // Judge deference of pconf version
        if (Object.keys(server).length
          != Object.keys(client ?? {}).length) {
          UploadPConfAPI(cookie.get('pconf'))
        }
      },
      onCancel: async () => {
        store.commit('pconf/set', client)
        cookie.set('pconf/useLocal', 'true')
      }
    })
  }
}

onMounted(() => {
  store.commit('signin/setSignined', configureXazhAxios)
  store.commit('signin/setSignined', getUserInfo)
  store.commit('signin/setSignined', syncPconf)
  // store.commit('logout', () => {})
})
</script>
<template>
  <div></div>
</template>