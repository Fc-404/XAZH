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
    id: '',
    user: '',
    token: '',
    info: {},
    signined: [],
    logout: []
  }),
  mutations: {
    async signin(state, value: { id: string, token: string }) {
      let rawToken = Base64.decode(value.token)
      let user = rawToken.slice(0, parseInt(rawToken.slice(-1), 36))
      cookie.set('id', value.id)
      cookie.set('user', user)
      cookie.set('token', value.token)
      state.id = value.id
      state.user = user
      state.token = value.token
      try {
        for (let i of state.signined)
          await i(state)
      } catch (e) {
        console.error(e);
      }
      state.on = true
    },
    async logout(state) {
      try {
        for (let i of state.logout)
          await i(state)
      } catch (e) {
        console.error(e);
      }
      cookie.remove('id')
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
    id(state): string {
      return state.id
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
        id: state.id,
        date: param.date,
        token: param.data
      }
    }
  }
}

export default signinStore