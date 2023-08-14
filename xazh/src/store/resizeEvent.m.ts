import { Module } from 'vuex'
import debounce from '../tools/debounce.tool'

type OnResizeEvent = {
  fn: Function,
  name: string,
  debounce?: number,
}

var onResizeEventCount: number = 0

const resizeEvent: Module<any, any> = {
  namespaced: false,
  state: () => ({
    // List of functions executed when changing the window size.
    onResize: {},
    resizeDebounce: {}
  }),
  mutations: {
    addResizeEvent(state, value: OnResizeEvent | Function) {
      let name: string
      let fn: Function
      let debouncems: number | undefined = 0
      if (typeof value == 'function') {
        name = (onResizeEventCount++).toString()
        fn = value as Function
      } else {
        name = value.name
        fn = value.fn
        debouncems = value?.debounce || 0
      }

      state.onResize[name] = fn
      state.resizeDebounce[name] = debouncems

      document.body.onresize = () => {
        for (let f in state.onResize)
          state.resizeDebounce[f]
            ? debounce(state.onResize[f] as Function, state.resizeDebounce[f])
            : (state.onResize[f] as Function)()
      }
    },
    removeResizeEvent(state, value: string) {
      delete state.onResize[value]
    }
  }
}

export default resizeEvent