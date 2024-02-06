import { useStore } from "vuex"

export function useTitle(title: string) {
  const store = useStore()

  onMounted(() => {
    store.commit('header/title', title)
  })

  onUnmounted(() => {
    store.commit('header/closeTitle')
  })
}