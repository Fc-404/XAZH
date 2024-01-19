<template>
  <div id="select-flex">
    <a-select
      v-model:value="itemsSelected"
      mode="multiple"
      style="width: 100%;"
      placeholder="点击添加"
    >
      <template #dropdownRender>
        <div style="height: .2rem;"></div>
        <a-input
          v-model:value="itemSearch"
          :placeholder="tipText.searchPlaceholder"
          @pressEnter="() => sortingItems()"
          @change="tipText.searchPlaceholder = '回车以搜索'"
          :maxlength="maxStr"
        ></a-input>

        <div
          id="select-flex-content"
          @mousedown.prevent
        >
          <a-empty
            v-if="items.length == 0"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
            style="width: 100%;"
          ></a-empty>
          <a-button
            :class="[props.flex ? 'select-flex-items' : 'select-flex-items-list']"
            v-for="i in items.length"
            @click="itemSelectedClick(i - 1)"
            :type="items[i - 1]['selected'] ? 'primary' : (
              props.flex ? 'default' : 'text'
            )"
            v-html="highStr(items[i - 1]['name'])"
          ></a-button>
        </div>

        <a-divider style="margin: 4px 0" />
        <a-space id="select-flex-new">
          <a-input
            v-model:value="newItemStr"
            :placeholder="tipText.newPlaceholder"
            @change="tipText.newPlaceholder = '新建名称'"
            :maxlength="maxStr"
          />
          <a-button
            type="text"
            @click="newItem"
            :loading="isItemNewing"
            :disabled="isItemNewing"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新建
          </a-button>
        </a-space>
        <div style="height: .2rem;"></div>
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  flex: {
    type: Boolean,
    default: true
  },
  search: {
    type: Boolean,
    default: true
  },
  newItem: {
    type: Boolean,
    dafault: true
  },
  newItemEvent: {
    type: Function,
    default: () => { }
  },
  newItemException: {
    type: Function,
    default: () => { }
  },
  options: {
    type: Array<string>,
    dafault: []
  },
  value: {
    type: Array<string>,
    default: []
  }
})

const emit = defineEmits(['update:value'])

const items = ref<Array<{ name: string, selected: boolean }>>([])
const itemsSelected = ref<Array<string>>(props.value)
const itemSearch = ref<string>('')
const newItemStr = ref<string>('')

const tipText = reactive({
  newPlaceholder: '新建',
  searchPlaceholder: '回车以搜索'
})
const isItemNewing = ref<boolean>(false)

const maxStr: number = 16

/**
 * Init the items.
 */
for (let i of props.options ?? []) {
  items.value.push({
    name: i, selected: false
  })
}

/**
 * The algorithm for sorting the items.
 */
const sortingItems = function () {
  const key = itemSearch.value
  let index = 0
  for (let i = 0; i < items.value.length; i++) {
    if (items.value[i]['name'] == key) {
      items.value.unshift(items.value[i])
      items.value.splice(i + 1, 1)
      ++index
      continue
    }
    if (items.value[i]['name'].indexOf(key) != -1) {
      let t = items.value[index]
      items.value[index] = items.value[i]
      items.value[i] = t
      ++index
    }
  }
  if (index == 0) {
    itemSearch.value = ''
    tipText.searchPlaceholder = '无匹配值，请重试...'
  }
}

/**
 * New item.
 */
const newItem = async function () {
  for (let i of items.value)
    if (newItemStr.value == i['name']) {
      tipText.newPlaceholder = '名称重复，请重试'
      newItemStr.value = ''
      return
    }

  isItemNewing.value = true
  const result = await props.newItemEvent()
  if (result == false) {
    tipText.newPlaceholder = '错误，请重试...'
    props.newItemException()
  } else {
    items.value.push({
      name: newItemStr.value || '新建',
      selected: false
    })
    tipText.newPlaceholder = '新建'
  }
  newItemStr.value = ''
  isItemNewing.value = false
}

/**
 * Selected item.
 */
const itemSelectedClick = function (i: number) {
  let selected = items.value[i]['selected']
  if (selected) {
    itemsSelected.value.splice(
      itemsSelected.value.indexOf(items.value[i]['name']), 1
    )
    items.value[i]['selected'] = false
  } else {
    itemsSelected.value.push(items.value[i]['name'])
    items.value[i]['selected'] = true
  }
  emit('update:value', itemsSelected.value)
}

/**
 * High light string.
 */
const highStr = function (str: string) {
  const index = str.indexOf(itemSearch.value)
  if (index != -1) {
    return `${str.slice(0, index)}<span style="color: var(--red);">
      ${str.slice(index, index + itemSearch.value.length)}
      </span>${str.slice(index + itemSearch.value.length)}`
  }
  return str
}
</script>

<style scoped lang="less">
#select-flex {
  width: 100%;
  min-width: 12rem;

  &-content {
    display: flex;
    flex-wrap: wrap;
    margin: .8rem auto;
    min-height: 3rem;
    max-height: 12rem;
    overflow: auto;
  }

  &-new {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}

.select-flex-items {
  margin: .2rem;
}

.select-flex-items-list {
  margin: .1rem;
  width: calc(100% - .2rem);
  text-align: left;
}
</style>