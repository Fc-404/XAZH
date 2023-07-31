import { Store, createStore } from "vuex"

import Config from './config.m.ts'

const store: Store<unknown> = createStore({
  state: () => { },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: Config
  }
})

export default store