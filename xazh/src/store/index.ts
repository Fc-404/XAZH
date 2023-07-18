import { Store, createStore } from "vuex"

const store: Store<unknown> = createStore({
  state() {
    return {
      count: 2,
    }
  },
  mutations: {
  }
})

export default store