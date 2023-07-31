/**
 * Switch style in the light of platform
 */

import { StylePageI } from "../interface/page.i.ts";
import { useStore } from "vuex";

const components: Array<string> = []

export default function (m: StylePageI) {
  const store = useStore()

  const alterIdName = () => {
    switch (store.getters["config/platform"]) {
      case 'Desktop':
        m.style.value = m.name
        break
      case 'Mobile':
        m.style.value = m.name + '-m'
        break
    }
  }
  alterIdName()

  if (components.find(value => value == m.name) === undefined) {
    store.subscribe((m) => {
      if (m.type == 'config/platform')
        alterIdName()
    })
    components.push(m.name)
  }
}