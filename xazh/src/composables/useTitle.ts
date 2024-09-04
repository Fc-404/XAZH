import { useStore } from 'vuex'

export function useTitle(title: Ref<string | null | undefined> | string) {
  const store = useStore()
  if (typeof title === 'string') title = ref(title)

  watch(title, (v) => {
    store.commit('header/title', v)
  })

  onUnmounted(() => {
    store.commit('header/closeTitle')
  })
}
