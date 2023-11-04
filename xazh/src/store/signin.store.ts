/**
 * Signin store.
 */

import { Module } from "vuex";
import cookie from 'js-cookie'
import { Base64 } from "js-base64";
import { base64WithDate } from "../util/encodeMsg.tool";

const signinStore: Module<any, any> = {
  namespaced: true,
  state: () => ({
    on: false,
    user: '',
    token: '',
    info: {},
    signined: [],
    logout: []
  }),
  mutations: {
    signin(state, value: string) {
      let rawToken = Base64.decode(value)
      let user = rawToken.slice(0, parseInt(rawToken.slice(-1), 36))
      cookie.set('user', user)
      cookie.set('token', value)
      state.user = user
      state.token = value
      try {
        for (let i of state.signined)
          i(state)
      } catch { }
      state.on = true
    },
    logout(state) {
      try {
        for (let i of state.logout)
          i(state)
      } catch { }
      cookie.remove('user')
      cookie.remove('token')
      state.on = false
    },
    info(state, value: object) {
      state.info = value
    },
    setSignined(state, value: Function) {
      state.signined.push(value)
    },
    setLogout(state, value: Function) {
      state.logout.push(value)
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
    },
    requireParam(state): object {
      const param = base64WithDate(state.token)
      return {
        date: param.date,
        user: state.user,
        token: param.data
      }
    }
  }
}

export default signinStore