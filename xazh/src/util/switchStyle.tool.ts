/**
 * Switch style in the light of platform
 */

import { StylePageI } from "../interface/page.i.ts";
import { useStore } from "vuex";

var isSubscribe = false

export default function (m: StylePageI) {
  const store = useStore()

  const alterIdName = () => {
    switch (store.getters["config/platform"]) {
      case 'Windows':
      case 'Linux':
      case 'Mac':
      case 'Desktop':
        m.mobile ? m.mobile.value = false : null
        m.onDesktop ? m.onDesktop() : null
        break
      case 'Android':
      case 'IOS':
      case 'Mobile':
        m.mobile ? m.mobile.value = true : null
        m.onMobile ? m.onMobile() : null
        break
    }
  }
  alterIdName()

  if (!isSubscribe) {
    store.subscribe((m) => {
      if (m.type == 'config/platform')
        alterIdName()
    })
  }
}