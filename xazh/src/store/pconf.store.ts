/**
 * Personal config.
 */

import { Md5 } from "ts-md5";
import { Module } from "vuex";
import cookie from 'js-cookie'

const pconfStore: Module<any, any> = {
  namespaced: true,
  state: () => ({
    version: '',
    /**
     * Header
     */
    headerProgress: true,
    headerTitleRoll: true,

    /**
     * Style
     */
    stylePrimaryColor: ' ',
    stylePageAnimation: true,

    /**
     * Blogs Editor
     */
    blogsEditorAutoSave: '30000'
  }),
  getters: {
    version: function (state) {
      return state.version
    },
    headerProgress: function (state) {
      return state.headerProgress
    },
    headerTitleRoll: function (state) {
      return state.headerTitleRoll
    },
    stylePrimaryColor: function (state) {
      return state.stylePrimaryColor
    },
    stylePageAnimation: function (state) {
      return state.stylePageAnimation
    },
    blogsEditorAutoSave: function (state) {
      return state.blogsEditorAutoSave
    },
  },
  mutations: {
    set: function (state, config) {
      try {
        for (let i of Object.keys(config)) {
          if (state[i])
            state[i] = config[i]
        }
        const { version, ...param } = state
        state.version = Md5.hashStr(JSON.stringify(param))
        cookie.set('pconf', JSON.stringify({
          version: state.version,
          date: config['date'] || new Date(),
          ...param
        }))
      } catch {
        return
      }
    },
  }
}

export default pconfStore