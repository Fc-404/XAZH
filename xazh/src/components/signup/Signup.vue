<template>
  <div
    id="signup"
    :class="platform"
  >
    <div id="signup-tip"></div>
    <div id="signup-panel"></div>
  </div>
</template>

<script setup lang="ts">

import { useStore } from "vuex";
import { Ref } from "vue";

const store = useStore()

let platform: Ref<string>
platform = store.getters["config/platform"]

</script>

<style scoped lang="scss">
#signup {
  border-radius: 1.2rem;
  margin: 1rem auto;
  width: 44rem;
  height: 26rem;
  background-color: #e5e5e5;
  overflow: hidden;

  &-tip,
  &-panel {
    height: 26rem;
    display: inline-block;
  }

  &-tip {
    width: 24rem;
    background-color: red;
  }

  &-panel {
    width: 20rem;
    background-color: blue;
  }
}


.Mobile {
  width: 20rem !important;

  #signup-tip {
    display: none;
  }
}
</style>