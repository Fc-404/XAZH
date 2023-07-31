import { Ref } from 'vue'

export interface StylePageI {
  // root name in component
  name: string,
  // id name of component style
  style: Ref<string>,
}