import { Module } from "vuex";
import cookie from 'js-cookie'

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
        cookie.remove('token')
      }
    },
    signinToken(state, value: string) {
      cookie.set('token', value)
      state.signinToken = value
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