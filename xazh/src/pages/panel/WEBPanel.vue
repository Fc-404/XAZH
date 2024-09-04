<template>
  <div id="webpanel">
    <div style="height: 32px;"></div>
    <a-affix
      :offsetTop="96"
      style="width: 20rem; display: inline-block; position: relative;"
    >
      <div id="webpanel-title">网站控制面板</div>
      <a-menu
        id="webpanel-menu"
        :items="items"
        mode="inline"
        style="width: 20rem;"
        @click="itemClick"
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
      >
      </a-menu>
    </a-affix>
    <div id="webpanel-view">
      <RouterView> </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MailOutlined, CloudOutlined,
  AreaChartOutlined, FileSearchOutlined,
  ProfileOutlined, FundProjectionScreenOutlined
} from '@ant-design/icons-vue';
import { ItemType } from 'ant-design-vue';
import { VueElement } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()

const selectedKeys = ref<Array<string>>([])
const openKeys = ref<Array<string>>([])

const setFooterMargin = inject('setFooterMargin') as Function
let subitemSections: Array<Element> = []
let sectionObserver = new Map()
let observer: IntersectionObserver

const getItem = function (
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const icon = function (icon: any) {
  return h(icon, {
    style: {
      color: 'var(--colorPrimary)'
    }
  })
}

const items: ItemType[] = [
  getItem('网站看板', 'performance', icon(FundProjectionScreenOutlined)),
  getItem('推送', 'push', icon(CloudOutlined), [
    getItem('公告', 'push/notice'),
    getItem('首页置顶', 'push/maintop'),
    getItem('首页推荐', 'push/mainrecommendation'),
    getItem('登录背景', 'push/loginbackgroud'),
    getItem('每日推荐', 'push/day'),
  ]),
  getItem('信箱', 'mailbox', icon(MailOutlined), [
    getItem('举报信箱', 'mailbox/report'),
    getItem('反馈信箱', 'mailbox/feedback'),
  ]),
  getItem('博客选项', 'blogoptions', icon(ProfileOutlined), [
    getItem('博客封面', 'blogoptions/cover'),
    getItem('博客标签', 'blogoptions/tags')
  ]),
  getItem('审核', 'examination', icon(FileSearchOutlined)),
  getItem('热度分析', 'heatanalysis', icon(AreaChartOutlined)),
]

let itemParent: string
let protectItemKey: boolean = true
const itemClick = async function (e: any) {
  await router.replace({
    path: '/webpanel/' + e.key
  })

  // Bind observer to DOM
  const i = e.key.indexOf('/')
  const parent = i == -1 ? e.key : e.key.slice(0, i)
  if (parent != itemParent || 1) {
    sectionObserver.clear()
    subitemSections.forEach(element => {
      observer.unobserve(element)
    })
    subitemSections = []
    subitemSections.push(...document.querySelectorAll('#webpanel-view section'))
    subitemSections.forEach(element => {
      observer.observe(element)
    })
  }
  protectItemKey = true
  itemParent = parent
}

/**
 * Set the selectedKeys according to URL's parameter.
 */
const setSelectedKey = function () {
  const key = route.path.slice(route.path.indexOf('/', 1) + 1)
  const i = key.indexOf('/')
  itemParent = i == -1 ? key : key.slice(0, key.indexOf('/'))
  selectedKeys.value = [key]
  openKeys.value = [itemParent]
}
setSelectedKey()
watch(() => route.path, setSelectedKey)

/**
 * Subitem follow the Page in RouterView.
 */
const switchSubitemActive = function () {
  const setKey = function (i: Element | undefined) {
    if (!i) return
    if (protectItemKey) {
      protectItemKey = false
      return
    }
    const name = i.getAttribute('name')
    if (name) selectedKeys.value = [itemParent + '/' + name]
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(i => {
      let name = i.target.getAttribute('name')
      if (!name) return
      if (i.isIntersecting) {
        sectionObserver.set(name, {
          el: i.target,
          ratio: i.intersectionRatio
        })
      } else {
        sectionObserver.delete(name)
      }
    })

    let maxSection: any = undefined
    sectionObserver.forEach(i => {
      if (!maxSection) maxSection = i
      if (i?.ratio > maxSection?.ratio)
        maxSection = i
    })
    setKey(maxSection?.el)
  }, {
    threshold: [0, .25, .5, .75, 1]
  })

  // Bind observer to DOM
  subitemSections.push(...document.querySelectorAll('#webpanel-view section'))
  subitemSections.forEach(element => {
    observer.observe(element)
  })
}

/**
 * Set Footer Offset.
 */
onMounted(() => {
  setFooterMargin('-20rem')
  switchSubitemActive()
})
onUnmounted(() => {
  setFooterMargin()
  observer.disconnect()
})
</script>

<style scoped lang="less">
#webpanel {
  width: 100%;
  min-height: 0 !important;

  &-title {
    position: absolute;
    top: 1.5rem;
    left: 1.8rem;
    font-size: 1.5rem;
    color: var(--colorTextQuaternary);
  }

  &-menu {
    display: inline-block;
    width: 20rem;
    height: calc(100vh - 96px);
    padding-top: 5rem;
    overflow: auto;
    border-radius: 0 1rem 0 0;
  }

  &-view {
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 20rem);
    padding: 0 6rem 6rem 6rem;
  }
}
</style>