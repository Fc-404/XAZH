<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

const store = useStore()

useRouter().replace({
  name: 'Main'
})

/**
 * Switch what style of display in the light of
 * change of window width and user's selection.
 */
if (window.outerWidth <= 1024) {
  store.commit('config/platform', 'Mobile')
}
// document.body.onresize = function () {
//   alert()
// }

</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
