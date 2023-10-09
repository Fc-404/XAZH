/**
 * Personal config.
 */

import { Module } from "vuex";

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
    init: function (state, config) {
      try {
        JSON.stringify(config)
      } catch {
        return
      }
      for (let i of Object.keys(config)) {
        if (state[i])
          state[i] = config[i]
      }
    }
  }
}

export default pconfStore