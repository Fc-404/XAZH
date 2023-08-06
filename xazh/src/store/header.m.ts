import { Module } from "vuex";
import { ModeTitlePageI } from "../interface/page.i";

var progressDebounceHandle: any

const header: Module<any, any> = {
  namespaced: true,
  state: () => ({
    onProgress: true,
    progress: 0,
    title: null,
    titleMode: ModeTitlePageI.SCROLL,
    changeTitleHandle: () => { },
    closeTitleHandle: () => { }
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
    titleMode(state): ModeTitlePageI {
      return state.titleMode
    }
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
      console.log(state.changeTitleHandle);
    },
    titleMode(state, v: ModeTitlePageI) {
      state.titleMode = v
    },
    closeTitle(state) {
      state.title = null
      state.closeTitleHandle()
    },
    changeTitleHandle(state, v: Function) {
      state.changeTitleHandle = v
    },
    closeTitleHandle(state, v: Function) {
      state.closeTitleHandle = v
    }
  },
  actions: {}
}

export default header