import { Module } from 'vuex'
import { message } from 'ant-design-vue'

const ant: Module<any, any> = {
  namespaced: false,
  state: () => ({
    antMessage: {
      api: null,
      context: null,
    },
    themeToken: null
  }),
  getters: {
    antMessage(state): typeof state.antMessage {
      if (!state.antMessage.api || !state.antMessage.context) {
        const [api, context] = message.useMessage()
        state.antMessage.api = api
        state.antMessage.context = context
      }
      return state.antMessage
    },
    themeToken(state) {
      return state.themeToken
    }
  },
  mutations: {
    themeToken(state, value) {
      state.themeToken = value
    }
  },
  actions: {}
}

export default ant