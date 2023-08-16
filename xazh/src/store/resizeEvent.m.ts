import { Module } from 'vuex'
import debounce from '../tools/debounce.tool'

type OnResizeEvent = {
  fn: Function,
  name: string,
  debounce?: number,
}

const resizeDebounce: any = {}
var onResizeEventCount: number = 0
var v: boolean = true

const resizeEvent: Module<any, any> = {
  namespaced: false,
  state: () => ({
    // List of functions executed when changing the window size.
    onResize: {},

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
      resizeDebounce[name] = debouncems

      if (v) {
        document.body.onresize = () => {
          for (let f in state.onResize)
            resizeDebounce[f]
              ? debounce(state.onResize[f] as Function, resizeDebounce[f])
              : (state.onResize[f] as Function)()
        }
        v = false
      }
    },
    removeResizeEvent(state, value: string) {
      delete state.onResize[value]
    }
  }
}

export default resizeEvent