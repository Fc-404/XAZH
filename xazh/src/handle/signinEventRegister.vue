<!-- Signin event register -->

<script setup lang="ts">
import axios from 'axios';
import cookie from 'js-cookie'
import { useStore } from 'vuex'
import { AxiosErrorCatch } from '../util/error.axios.tool';
import { Modal } from 'ant-design-vue';
const store = useStore()

const getUserInfo = function () {
  // const userInfo
  axios.post('/User/GetUserInfo', {
    ...store.getters['signin/requireParam']
  })
    .then((r) => {
      store.commit('signin/info', r.data.body)
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
  } catch { }

  axios.post('/User/Config/PConf/Sync', {
    ...store.getters['signin/requireParam'],
    version: pconf?.version ?? 'undefined'
  })
    .then(async (r) => {
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
          store.commit('pconf/set', null)
          console.log(cookie.get('pconf'));
          await uploadPConf(cookie.get('pconf'))
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

  const uploadPConf = async function (client: any) {
    const { version, date, ...pconf } = client

    await axios.post('/User/Config/PConf/Upload', {
      version: version,
      ...store.getters['signin/requireParam'],
      ...pconf
    })
      .catch(AxiosErrorCatch)
  }
}

onMounted(() => {
  store.commit('signin/setSignined', getUserInfo)
  store.commit('signin/setSignined', syncPconf)
  // store.commit('logout', () => {})
})
</script>
<template>
  <div></div>
</template>