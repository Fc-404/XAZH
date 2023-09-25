/**
 * Personal config.
 */

import { Module } from "vuex";

const pconfStore: Module<any, any> = {
  namespaced: true,
  state: () => ({
    version: '',
    /**
     * Header
     */
    headerProgress: true,
    headerTitleRoll: true,

    /**
     * Style
     */
    stylePrimaryColor: '',
    stylePageAnimation: true,
  })
}

export default pconfStore