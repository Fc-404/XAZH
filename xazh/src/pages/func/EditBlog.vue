<template>
  <div id="editp">
    <div id="editp-head">
      <a-button
        type="text"
        @click="back"
      >
        <LeftOutlined style="margin-left: -6px;" />
        返回
      </a-button>
      <div style="width: 1rem;"></div>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <a-input
        placeholder="标题"
        :bordered="false"
        :maxlength="64"
        show-count
        v-model:value="title"
      ></a-input>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <div style="width: 1.8rem;"></div>
      <a-button
        type="primary"
        @click="publishBtn"
      >发布</a-button>
      <a-popover
        placement="bottomRight"
        trigger="click"
      >
        <template #content>
          <table id="editp-head-setting-table">
            <tr>
              <td>自动保存</td>
              <td>
                <a-switch
                  v-model:checked="autoSave"
                  @click="changeAutoSave"
                ></a-switch>
              </td>
            </tr>
            <tr v-show="autoSave">
              <td>保存间隔</td>
              <td>
                <a-input-number
                  size="small"
                  :bordered="false"
                  :controls="false"
                  :precision="0"
                  v-model:value="autoSaveTimeout"
                  max="300"
                  min="10"
                  style="width: 2.4rem"
                  @change="changeAutoSaveTimeout"
                ></a-input-number>秒
              </td>
            </tr>
          </table>
        </template>
        <a-button
          id="editp-head-setting"
          type="text"
        >
          <SettingOutlined></SettingOutlined>
        </a-button>
      </a-popover>
    </div>
    <div id="editp-">
      <Editor
        :save="save"
        :value="draftContent"
        style="position: relative; z-index: 99;"
        ref="editor"
      ></Editor>
    </div>
    <div id="editp-publish">
      <a-modal
        v-model:open="blogPublishOpen"
        width="44rem"
      >
        <p id="editp-publish-title">发布文章</p>
        <form id="editp-publish-form">
          <tr>
            <td>文章封面</td>
            <td>h</td>
          </tr>
          <tr>
            <td>文章标签</td>
            <td>nihao, haha</td>
          </tr>
          <tr>
            <td>文章摘要</td>
            <td>fjieajfowieajfoi</td>
          </tr>
          <tr>
            <td>文章专栏</td>
            <td>哈哈</td>
          </tr>
          <tr>
            <td>文章类型</td>
            <td>
              <a-radio-group
                v-model:value="blogInfo.type"
                button-style="solid"
              >
                <a-radio-button value="original">原创</a-radio-button>
                <a-radio-button value="retransmit">转载</a-radio-button>
                <a-radio-button value="modification">二创</a-radio-button>
              </a-radio-group>
            </td>
          </tr>
          <tr>
            <td>访问权限</td>
            <td>
              <a-radio-group
                v-model:value="blogInfo.privacy"
                buttonStyle="solid"
              >
                <a-radio-button value="public">公开</a-radio-button>
                <a-radio-button value="follow">关注&粉丝</a-radio-button>
                <a-radio-button value="friend">仅好友</a-radio-button>
                <a-radio-button value="self">仅自己</a-radio-button>
              </a-radio-group>
            </td>
          </tr>
          <tr>
            <td :class="[blogInfoValid.timing ? '' : 'error']">定时发送
            </td>
            <td>
              <a-checkbox v-model:checked="blogInfo.timing.open">开启</a-checkbox>
              <span v-show=blogInfo.timing.open>
                <a-divider type="vertical"></a-divider> {{
                  Number.isNaN(blogInfoTimingResult.getTime()) ? '' :
                  (blogInfoTimingResult.getFullYear() + '-' +
                    (blogInfoTimingResult.getMonth() + 1) + '-' +
                    blogInfoTimingResult.getDate() + ' ' +
                    blogInfoTimingResult.getHours() + ':' +
                    blogInfoTimingResult.getMinutes() + ':' +
                    blogInfoTimingResult.getSeconds())
                }}</span><br>
              <div v-show="blogInfo.timing.open">
                <a-date-picker v-model:value="blogInfo.timing.date"></a-date-picker>
                <a-divider type="vertical"></a-divider>
                <a-time-picker v-model:value="blogInfo.timing.time"></a-time-picker>
              </div>
            </td>
          </tr>
        </form>
        <template #footer>
          <a-button>取消</a-button>
          <a-button @click="save">保存草稿</a-button>
          <a-button type="primary">发布文章</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { message, notification } from 'ant-design-vue';
import { useStore } from 'vuex';
import { UploadPConfAPI } from '../../api/config.user.api'
import { debounceByName } from '../../util/debounce.tool';

const store = useStore()

const title = ref<string>()
const editor = ref()
const draftContent = ref<string>()
let autoSaveHandle: NodeJS.Timer

const autoSave = ref<boolean>(store.getters['pconf/blogsEditorAutoSave'])
const autoSaveTimeout = ref<number>(store.getters['pconf/blogsEditorAutoSaveTimeout'])

const blogPublishOpen = ref<boolean>(false)
const blogInfo = reactive({
  type: 'original',
  privacy: 'public',
  timing: {
    open: false,
    date: '',
    time: '',
  }
})
const blogInfoValid = reactive({
  timing: true,
})

/**
 * Compute the timing result.
 */
const blogInfoTimingResult = computed(() => {
  const date = new Date(blogInfo.timing.date)
  const time = new Date(blogInfo.timing.time)

  const result = new Date(`
  ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
  ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}
  `)

  blogInfoValid.timing = !blogInfo.timing.open ||
    !!(result.getTime() - new Date().getTime() > 0)
  return result
})


/**
 * Save content to cookie.
 */
const save = function () {
  const draft = {
    title: title.value,
    content: editor.value.content,
    time: new Date(),
  }

  // cookie.set('EditBlog/draft', JSON.stringify(draft))
  localStorage.setItem('EditBlog/draft', JSON.stringify(draft))
  blogPublishOpen.value = false
  message.success('草稿已保存到本地！')
}

/**
 * Loading content from cookie.
 */
const loadingDraft = function () {
  try {
    // const draft = JSON.parse(cookie.get('EditBlog/draft') || '')
    const draft = JSON.parse(localStorage.getItem('EditBlog/draft') || '')

    title.value = draft.title
    draftContent.value = draft.content

    const time = new Date(draft.time)
    notification.success({
      message: '加载草稿成功！',
      description: h('table', [
        h('tr', [
          // h('td', '标题'),
          // h('td', '：'),
          h('td', `${title.value}`),
        ]),
        h('tr', [
          // h('td', '上次保存时间'),
          // h('td', '：'),
          h('td', {
            innerText: `${time.getFullYear()}年${time.getMonth()}月${time.getDate()}日`,
            style: {
              float: 'right'
            }
          }),
        ])
      ])
    })
  } catch {
    return
  }
}

/**
 * Change auto save option.
 */
const changeAutoSave = function () {
  store.commit('pconf/set', {
    blogsEditorAutoSave: autoSave.value
  })

  autoSave.value
    ? autoSaveHandle = setInterval(() => { save() },
      autoSaveTimeout.value * 1000)
    : clearInterval(autoSaveHandle)

  UploadPConfAPI()
}
const changeAutoSaveTimeout = function (v: any) {
  debounceByName('EditBlog/changeAutoSaveTimeout', () => {
    if (v < 10 || v > 300)
      return

    store.commit('pconf/set', {
      blogsEditorAutoSaveTimeout: v
    })

    clearInterval(autoSaveHandle)
    autoSaveHandle = setInterval(() => { save() },
      autoSaveTimeout.value * 1000)
    UploadPConfAPI()
  }, 200)
}

/**
 * Publish
 */
const publishBtn = function () {
  blogPublishOpen.value = true
}

/**
 * Back
 */
const back = function () {
  save()
}

/**
 * HOOK
 */
onBeforeMount(() => {
  loadingDraft()
})
onMounted(() => {
  window.onbeforeunload = function () {
    return '未保存草稿！'
  }
})
onUnmounted(() => {
  window.onbeforeunload = null
  clearInterval(autoSaveHandle)
})
</script>

<style scoped lang="less">
#editp {
  background: var(--colorBgLayout);

  &-head {
    height: 2rem;
    padding: .2rem .2rem .2rem .2rem;
    display: flex;

    &-setting {
      margin-left: .2rem;
      transition: height 1s;

      &-table {
        width: 16rem;

        td {
          padding: .4rem;
        }

        tr td:last-child {
          float: right;
        }
      }
    }

    .ant-divider {
      height: 100%;
    }

    .ant-input-affix-wrapper {
      font-size: 1.1rem;
    }
  }

  &- {
    height: calc(100vh - 2.4rem);
  }

  &-publish {
    &-title {
      font-size: 1.1rem;
      font-weight: bolder;
    }

    &-form {
      margin: 1rem;

      tr td {
        padding: .8rem;
      }

      tr td:first-child {
        padding-right: 1rem;
      }
    }
  }
}

.error {
  color: var(--red-6);
}
</style>