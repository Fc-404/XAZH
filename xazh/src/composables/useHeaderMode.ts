import { useStore } from "vuex"
import { ModeHeaderPageI } from "../interface/page.i"

export function useHeaderMode(mode: ModeHeaderPageI) {
  const store = useStore()

  onMounted(() => {
    store.commit('header/headerMode', mode)
  })

  onUnmounted(() => {
    store.commit('header/headerMode', ModeHeaderPageI.SCROLL)
  })
}