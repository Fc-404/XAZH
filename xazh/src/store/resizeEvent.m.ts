import { Module } from 'vuex'

type OnResizeEvent = {
  name: string,
  fn: Function
}

var onResizeEventCount: number = 0

const resizeEvent: Module<any, any> = {
  namespaced: false,
  state: () => ({
    // List of functions executed when changing the window size.
    onResize: {}
  }),
  mutations: {
    addResizeEvent(state, value: OnResizeEvent | Function) {
      let name: string
      let fn: Function
      if (typeof value == 'function') {
        name = (onResizeEventCount++).toString()
        fn = value as Function
      } else {
        name = value.name
        fn = value.fn
      }

      state.onResize[name] = fn

      document.body.onresize = () => {
        for (let f in state.onResize)
          (state.onResize[f] as Function)()
      }
    },
    removeResizeEvent(state, value: string) {
      delete state.onResize[value]
    }
  }
}

export default resizeEvent