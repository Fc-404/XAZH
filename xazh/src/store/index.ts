import { Store, createStore } from "vuex"

import Config from './config.store.ts'
import HeaderStore from './header.store.ts'
import ResizeEvent from './resizeEvent.store.ts'
import SigninStore from './signin.store.ts'
import PersonalConfig from './pconf.store.ts'

const store: Store<unknown> = createStore({
  state: () => { },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: Config,
    resizeEvent: ResizeEvent,
    header: HeaderStore,
    signin: SigninStore,
    pconf: PersonalConfig
  }
})

export default store