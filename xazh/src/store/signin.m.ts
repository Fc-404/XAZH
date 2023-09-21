import { Module } from "vuex";
import cookie from 'js-cookie'
import { Base64 } from "js-base64";

const signinStore: Module<any, any> = {
  namespaced: true,
  state: () => ({
    on: false,
    user: '',
    token: '',
    info: {},
    signined: () => { },
    logout: () => { }
  }),
  mutations: {
    signin(state, value: string) {
      let rawToken = Base64.decode(value)
      let user = rawToken.slice(0, parseInt(rawToken.slice(-1), 36))
      cookie.set('user', user)
      cookie.set('token', value)
      state.user = user
      state.token = value
      state.signined(state)
      state.on = true
    },
    logout(state) {
      state.logout(state)
      cookie.remove('user')
      cookie.remove('token')
      state.on = false
    },
    info(state, value: object) {
      state.info = value
    },
    setSignined(state, value: Function) {
      state.signined = value
    },
    setLogout(state, value: Function) {
      state.logout = value
    }
  },
  getters: {
    on(state): boolean {
      return state.on
    },
    user(state): string {
      return state.user
    },
    token(state): string {
      return state.token
    },
    info(state): object {
      return state.info
    }
  }
}

export default signinStore