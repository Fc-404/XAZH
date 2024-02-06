/**
 * The config of Header in Main page.
 */

import { Module } from "vuex";
import { ModeHeaderPageI } from "../interface/page.i";

var progressDebounceHandle: any

const header: Module<any, any> = {
  namespaced: true,
  state: () => ({
    onProgress: true,
    progress: 0,
    title: null,
    headerMode: ModeHeaderPageI.SCROLL,
    changeHeaderModeHandle: () => { },
    changeTitleHandle: () => { },
    closeTitleHandle: () => { },
    // Footer
  }),
  getters: {
    progress(state): number {
      return state.progress
    },
    onProgress(state): boolean {
      return state.onProgress
    },
    title(state): string | null {
      return state.title
    },
    headerMode(state): ModeHeaderPageI {
      return state.headerMode
    },
  },
  mutations: {
    onProgress(state, v: boolean) {
      state.onProgress = v
    },
    progress(state, v: number) {
      clearTimeout(progressDebounceHandle)
      progressDebounceHandle = setTimeout(() => {
        state.progress = v
      }, 44)
    },
    title(state, v: string | null) {
      state.title = v
      if (v === null) {
        state.closeTitleHandle()
        return
      }
      state.changeTitleHandle(v)
    },
    headerMode(state, v: ModeHeaderPageI) {
      state.headerMode = v
      state.changeHeaderModeHandle()
    },
    closeTitle(state) {
      state.title = null
      state.closeTitleHandle()
    },
    changeHeaderModeHandle(state, v: Function) {
      state.changeHeaderModeHandle = v
    },
    changeTitleHandle(state, v: Function) {
      state.changeTitleHandle = v
    },
    closeTitleHandle(state, v: Function) {
      state.closeTitleHandle = v
    },
  },
  actions: {}
}

export default header