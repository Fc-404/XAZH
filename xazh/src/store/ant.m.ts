import { Module} from "vuex"

const obj: Module<any, any> = {
  namespaced: true,
  state: () => ({
    message
  })
}

export default obj