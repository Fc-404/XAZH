import { Module } from "vuex";
import cookie from 'js-cookie'
import { Base64 } from "js-base64";

const signinStore: Module<any, any> = {
  namespaced: true,
  state: () => ({
    isSignin: false,
    signinToken: '',
    signined: () => { },
    logout: () => { }
  }),
  mutations: {
    isSignin(state, value: boolean) {
      state.isSignin = value
      if (value) {
        state.signined()
      } else {
        state.logout()
        cookie.remove('user')
        cookie.remove('token')
      }
    },
    signinToken(state, value: string) {
      let rawToken = Base64.decode(value)
      cookie.set('user', rawToken.slice(0, parseInt(rawToken.slice(-1), 36)))
      cookie.set('token', value)
      state.signinToken = value
      state.isSignin = true
    },
    signined(state, value: Function) {
      state.signined = value
    },
    logout(state, value: Function) {
      state.logout = value
    }
  },
  getters: {
    isSignin(state): boolean {
      return state.isSignin
    }
  }
}

export default signinStore