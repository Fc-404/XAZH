import { Module } from "vuex";

const config: Module<any, any> = {
  namespaced: true,
  state: () => ({
    /**
     * Attribute 'platform' is one of
     * Desktop, Mobile, Windows, Linux, Android, IOS.
     * */
    platform: 'Desktop',
    ondark: false,
    themeToken: null
  }),
  getters: {
    platform(state): string {
      return state.platform
    },
    isPlatform(state) {
      return (str: string | number): boolean =>
        !!([1, '1', 'd', 'D', 'desktop', 'Desktop'].find(i => i == str) && 'Desktop' == state.platform
          || [2, '2', 'm', 'M', 'mobile', 'Mobile'].find(i => i == str) && 'Mobile' == state.platform
          || [3, '3', 'w', 'W', 'windows', 'Windows'].find(i => i == str) && 'Windows' == state.platform
          || [4, '4', 'l', 'L', 'linux', 'Linux'].find(i => i == str) && 'Linux' == state.platform
          || [5, '5', 'a', 'A', 'android', 'Android'].find(i => i == str) && 'Android' == state.platform
          || [6, '6', 'i', 'I', 'ios', 'IOS'].find(i => i == str) && 'IOS' == state.platform
        )
    },
    ondark(state): boolean {
      return state.ondark
    },
    themeToken(state) {
      return state.themeToken
    }
  },
  mutations: {
    platform(state, platform): string {
      switch (platform) {
        case 1:
        case '1':
        case 'd':
        case 'D':
        case 'desktop':
        case 'Desktop':
          state.platform = 'Desktop'
          break
        case 2:
        case '2':
        case 'm':
        case 'M':
        case 'mobile':
        case 'Mobile':
          state.platform = 'Mobile'
          break
        case 3:
        case '3':
        case 'w':
        case 'W':
        case 'windows':
        case 'Windows':
          state.platform = 'Windows'
          break
        case 4:
        case '4':
        case 'l':
        case 'L':
        case 'linux':
        case 'Linux':
          state.platform = 'Linux'
          break
        case 5:
        case '5':
        case 'a':
        case 'A':
        case 'android':
        case 'Android':
          state.platform = 'Android'
          break
        case 6:
        case '6':
        case 'i':
        case 'I':
        case 'ios':
        case 'IOS':
          state.platform = 'IOS'
      }
      return state.platform
    },
    ondark(state, v: boolean = true) {
      state.ondark = v
    },
    themeToken(state, value) {
      state.themeToken = value
    }
  },
  actions: {}
}

export default config