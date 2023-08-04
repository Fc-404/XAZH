import { Module } from "vuex";

const header: Module<any, any> = {
  namespaced: true,
  state: () => ({
    onProgress: true,
    progress: null,
    title: '',
  }),
  getters: {
    progress(state): number {
      return state.process
    },
    onProgress(state): boolean {
      return state.onProgress
    },
    title(state): string {
      return state.title
    }
  },
  mutations: {
    onProgress(state, v: boolean) {
      state.onProgress = v
    },
    progress(state, v: number) {
      state.progress = v
    },
  },
  actions: {}
}

export default header