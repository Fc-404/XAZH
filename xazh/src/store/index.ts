import { Store, createStore } from "vuex"

import Config from './config.m.ts'
import Ant from './ant.m.ts'

const store: Store<unknown> = createStore({
  state: () => { },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: Config,
    ant: Ant,
  }
})

export default store