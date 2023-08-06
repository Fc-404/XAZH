import { Ref } from 'vue'


/**
 * Page Style. For switching over the page layout.
 */
export interface StylePageI {
  // root name in component
  name: string,
  // id name of component style
  style: Ref<string>,
}


/**
 * Page Header. For display the correlative information in the header component.
 */
export enum ModeTitlePageI {
  SCROLL,       // Show the title while down scroll otherwise show the menu.
  CONSTANT,     // Always show the title.
}