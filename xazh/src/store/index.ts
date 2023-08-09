import { Store, createStore } from "vuex"

import Config from './config.m.ts'
import Header from './header.m.ts'

const store: Store<unknown> = createStore({
  state: () => { },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: Config,
    header: Header,
  }
})

export default store