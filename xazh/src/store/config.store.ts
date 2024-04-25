/**
 * The config of the web that usually out of sync.
 */

import { Module } from 'vuex'

const config: Module<any, any> = {
  namespaced: true,
  state: () => ({
    name: '夏至星球',
    /**
     * Attribute 'platform' is one of
     * Desktop, Mobile, Windows, Linux, Mac, Android, IOS.
     * */
    platform: 'Desktop',
    // Whether dark of theme
    ondark: false,
    // Antdv's theme token
    themeToken: null,
    // Backend API base address.
    baseApi: 'http://192.168.22.32:7001/',
  }),
  getters: {
    name(state): string {
      return state.name
    },
    platform(state): string {
      return state.platform
    },
    isPlatform(state) {
      return (str: string | number): boolean =>
        !!(
          ([1, '1', 'd', 'D', 'desktop', 'Desktop'].find((i) => i == str) &&
            'Desktop' == state.platform) ||
          ([2, '2', 'm', 'M', 'mobile', 'Mobile'].find((i) => i == str) &&
            'Mobile' == state.platform) ||
          ([3, '3', 'w', 'W', 'windows', 'Windows'].find((i) => i == str) &&
            'Windows' == state.platform) ||
          ([4, '4', 'l', 'L', 'linux', 'Linux'].find((i) => i == str) &&
            'Linux' == state.platform) ||
          ([5, '5', 'mac', 'Mac'].find((i) => i == str) &&
            'Mac' == state.platform) ||
          ([6, '6', 'a', 'A', 'android', 'Android'].find((i) => i == str) &&
            'Android' == state.platform) ||
          ([7, '7', 'i', 'I', 'ios', 'IOS'].find((i) => i == str) &&
            'IOS' == state.platform)
        )
    },
    adaptPlatform(state) {
      return (str: 'Desktop' | 'Mobile'): boolean =>
        !!(
          (str == 'Desktop' &&
            ['Desktop', 'Windows', 'Linux', 'Mac'].find(
              (i) => i == state.platform
            )) ||
          (str == 'Mobile' &&
            ['Mobile', 'Android', 'IOS'].find((i) => i == state.platform))
        )
    },
    ondark(state): boolean {
      return state.ondark
    },
    themeToken(state) {
      return state.themeToken
    },
    baseApi(state) {
      return state.baseApi
    },
    fileUrl(state) {
      return (fid: string | null | undefined) => {
        if (!fid) return 'ErrorFileURL'
        let url = (state.baseApi.slice(-1) == '/' ? 'File/' : '/File/') + fid
        return state.baseApi + url
      }
    },
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
        case 'mac':
        case 'Mac':
          state.platform = 'Mac'
          break
        case 6:
        case '6':
        case 'a':
        case 'A':
        case 'android':
        case 'Android':
          state.platform = 'Android'
          break
        case 7:
        case '7':
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
    },
  },
  actions: {},
}

export default config
