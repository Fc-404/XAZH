import { Ref } from 'vue'


/**
 * Page Style. For switching over the page layout.
 */
export interface StylePageI {
  // root name in component
  name: string,
  // Whether mobile
  mobile?: Ref<boolean>,
  // Change callback
  onMobile?: Function,
  onDesktop?: Function
}

/**
 * Page Header. For display the correlative information in the header component.
 */
export enum ModeHeaderPageI {
  SCROLL,       // Show the title while scroll down otherwise show the menu.
  CONSTANT,     // Always show the title.
  AUTO_SHOW,    // Show if scroll up, hide if scroll down.
  AUTO_HIDDEN,  // Show when mouse enter top.
}