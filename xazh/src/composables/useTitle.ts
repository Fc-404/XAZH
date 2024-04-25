import { useStore } from 'vuex'

export function useTitle(title: Ref<string | null | undefined>) {
  const store = useStore()

  watch(title, (v) => {
    store.commit('header/title', v)
  })

  onUnmounted(() => {
    store.commit('header/closeTitle')
  })
}
