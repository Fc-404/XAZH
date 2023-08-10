import { Store, createStore } from "vuex"

import Config from './config.m.ts'
import Header from './header.m.ts'
import ResizeEvent from './resizeEvent.m.ts'

const store: Store<unknown> = createStore({
  state: () => { },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: Config,
    header: Header,
    resizeEvent: ResizeEvent
  }
})

export default store