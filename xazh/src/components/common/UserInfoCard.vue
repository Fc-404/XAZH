<template>
  <div id="userinfo-card" :style="props.style">
    <div id="userinfo-card-up">
      <a-avatar
        id="userinfo-card-up-img"
        :style="{ backgroundColor: user2ImgColor(props.info?.user) }"
        :src="store.getters['config/fileUrl'](props.info?.himg)"
        :title="props.info?.uid"
        @click="toUserHome()"
      >
        {{ user2ImgText(props.info?.user) }}
      </a-avatar>
      <div id="userinfo-card-up-info">
        <p id="userinfo-card-up-name" :title="props.info?.user">
          {{ props.info?.user }}
        </p>
        <div style="display: flex; margin-top: 0.4rem">
          <a-tag :color="getUserLevelTagColor(props.info?.level)" class="tag">
            {{ getUserLevelName(props.info?.level) }}
          </a-tag>
          <div>
            <a-divider type="vertical"></a-divider>
          </div>
          <div id="userinfo-card-up-exp">
            <span :title="props.info?.exp"> Exp: {{ props.info?.exp }} </span>
          </div>
        </div>
        <div id="userinfo-card-up-ranks">
          <a-tag v-if="props.info?.ranks.length == 0" class="tag">无头衔</a-tag>
          <a-tag v-for="i in $props.info?.ranks.slice(0, 6)" class="tag">
            {{ i }}
          </a-tag>
        </div>
        <div id="userinfo-card-up-local">
          <EnvironmentOutlined />
          {{ props.info.belong_place || '未知' }}
        </div>
      </div>
    </div>
    <div id="userinfo-card-down"></div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { user2ImgText, user2ImgColor } from '../../util/str.tool'
import { EnvironmentOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import {
  getUserLevelName,
  getUserLevelTagColor,
} from '../../types/level.user.type'

const store = useStore()
const router = useRouter()
const props = defineProps({
  info: { type: Object, default: {} },
  style: { type: Object, default: {} },
})

const toUserHome = function () {
  router.push('/home/' + props.info.uid)
}
</script>

<style scoped lang="less">
#userinfo-card {
  width: 20rem;
  height: auto;
  padding: 1rem;
  user-select: none;

  &-up {
    display: flex;

    &-img {
      border: none;
      width: 6rem;
      height: 6rem;
      margin-top: 0.5rem;
      margin-right: 1rem;
      font-size: 3.5rem;
      line-height: 5.5rem;
      user-select: none;
      cursor: pointer;
    }

    .tag {
      height: 1.2rem;
      font-size: 0.7rem;
      border: none;
    }

    &-info {
      margin-bottom: 0;
    }

    &-name {
      font-size: 1.5rem;
      color: var(--colorTextSecondary);
      text-wrap: nowrap;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
      width: 11rem;
    }

    &-exp {
      width: 6rem;
      font-size: 0.8rem;
      text-wrap: nowrap;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-ranks {
      display: flex;
      flex-wrap: wrap;
      width: 11rem;
      margin-top: 0.2rem;
      .tag {
        margin-top: 0.2rem;
      }
    }

    &-local {
      margin-top: 0.4rem;
      font-size: 0.8rem;
    }
  }
}
</style>
