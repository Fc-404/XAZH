<template>
  <div id="selfp">
    <!-- Handle -->
    <a-avatar
      id="selfp-head"
      :size="headImgSize"
      @click="openSelfpc"
    ></a-avatar>

    <!-- Panel -->
    <a-drawer
      v-model:open="selfpcOpen"
      :closable="false"
      :width="348"
    >
      <div id="selfp-ctl">
        <div id="selfp-ctl-info">
          <p>User</p>
          <p>Exp | Level</p>
          <p>Rank</p>
          <p>local</p>
        </div>
        <a-avatar id="selfp-ctl-img"></a-avatar>

        <a-divider class="selfp-ctl-fun"></a-divider>
        <!-- Function -->
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >messages</a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >blogs</a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >stars</a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >personal</a-button>
        <a-button
          type="text"
          class="selfp-ctl-fun"
        >setting</a-button>

        <a-divider
          class="selfp-ctl-fun"
          style="grid-row: -3 / -2;"
        ></a-divider>
        <!-- Logout -->
        <a-button
          danger
          type="primary"
          class="selfp-ctl-fun"
          style="grid-row: -2 / -1;"
          @click="logout"
        >logout</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { message } from 'ant-design-vue'

const store = useStore()

// head-img size
const headImgSize: number =
  parseInt(
    window.getComputedStyle(document.body).getPropertyValue('--headerHeight').slice(0, -2)
  ) * 0.66

const selfpcOpen = ref<boolean>(true)
// open self-panel
const openSelfpc = function () {
  selfpcOpen.value = !selfpcOpen.value
}

// Logout
const logout = function () {
  store.commit('signin/isSignin', false)
  message.success('账号已退出！')
}
</script>

<style scoped lang="less">
#selfp {
  position: sticky;
  top: 0;

  &-head {
    margin-bottom: 4px;
  }

  &-ctl {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 50px);
    grid-template-rows: repeat(auto-fill, 50px);

    &-info {
      grid-column: 4 / 7;
      grid-row: 1 / 3;
      padding-top: .5rem;
      padding-right: 3rem;
      font-size: 1.1rem;
      color: var(--colorTextBase);
    }

    &-img {
      grid-column: 1 / 3;
      grid-row: 1 / 3;

      width: 100%;
      height: 100%;
    }

    .selfp-ctl-fun {
      grid-column: 1 / fill;
      font-size: 1.2rem;
      line-height: 1.2rem;
      padding-left: 1rem;
      height: 100%;
      text-align: left;

      user-select: none;
      cursor: pointer;

      &:last-child {
        text-align: center;
      }
    }
  }
}
</style>