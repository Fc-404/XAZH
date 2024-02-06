/**
 * Personal config.
 */

import { Module } from "vuex";
import cookie from 'js-cookie'
import { Md5 } from 'ts-md5'

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
    stylePrimaryColor: '',
    stylePageAnimation: true,

    /**
     * Blogs Editor
     */
    blogsEditorAutoSave: true,
    blogsEditorAutoSaveTimeout: 60,
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
    blogsEditorAutoSaveTimeout: function (state) {
      return state.blogsEditorAutoSaveTimeout
    }
  },
  mutations: {
    set: function (state, config) {
      let date = new Date()
      try {
        for (let i of Object.keys(config)) {
          if (state[i] != undefined) {
            if (typeof config[i] == typeof state[i]) {
              state[i] = config[i]
            }
          }
        }
        config['date'] ? date = config['date'] : null
      } catch {
        console.warn('pconf: set error');
      }
      const { version, ...param } = state
      state.version = Md5.hashStr(JSON.stringify(param))
      cookie.set('pconf', JSON.stringify({
        version: state.version,
        date: date,
        ...param
      }))
    },
  }
}

export default pconfStore