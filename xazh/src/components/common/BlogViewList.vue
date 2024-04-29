<template>
  <div ref="root" id="blogviewlist" :title="bid" @click="toBlogPage">
    <LazyComponent id="blogviewlist-" @intersected="getBlogInfo">
      <div id="blogviewlist-cover">
        <img v-if="blogCoverSrc" :src="blogCoverSrc" />
      </div>
      <div>
        <div id="blogviewlist-title">
          <h2 :title="blogInfo.title" :class="[loadedBlog ? '' : 'loading']">
            {{ blogInfo.title }}
          </h2>
          <div>
            <span> <EyeOutlined />{{ blogInfo.readcount }}</span>
            <span> <LikeOutlined />{{ blogInfo.likecount }}</span>
            <span> <StarOutlined />{{ blogInfo.starcount }}</span>
          </div>
        </div>
        <div id="blogviewlist-info" :class="[loadedBlog ? '' : 'loading']">
          <a-tag style="border: none" :color="getBlogTypeColor(blogInfo.type)">
            {{ getBlogTypeName(blogInfo.type) }}
          </a-tag>
          <span>{{ blogInfo.authorName }}</span>
          <span>
            {{
              blogInfo.createtime
                ? formatDate(
                    'YYYY-MM-DD hh:mm:ss',
                    new Date(blogInfo.createtime)
                  )
                : ''
            }}
          </span>
        </div>
        <p v-if="blogInfo.abstract" :title="blogInfo.abstract" :class="[loadedBlog ? '' : 'loading']">
          {{ blogInfo.abstract }}
        </p>
        <div v-if="props.ctl" id="blogviewlist-func">
          <a-button type="link" @click.stop="toEditBlog"> 编辑 </a-button>
          <a-popconfirm
            title="确定要删除这篇博客吗？"
            okText="确定"
            cancelText="取消"
            @confirm="deleteBlog"
          >
            <a-button type="link" @click.stop danger>删除</a-button>
          </a-popconfirm>
        </div>
        <div v-else style="height: 1.5rem"></div>
      </div>
    </LazyComponent>
  </div>
</template>

<script setup lang="ts">
import LazyComponent from 'v-lazy-component'
import { formatDate } from '../../util/formatDate.tool'
import { getBlogTypeColor, getBlogTypeName } from '../../types/blog.type'
import { StarOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { DeleteBlogAPI, GetBlogsInfoAPI } from '../../api/blog.api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

const store = useStore()
const router = useRouter()
const root = ref<HTMLElement>()
const props = defineProps({
  bid: String,
  info: { type: Object, default: null },
  chunk: { type: String, default: undefined },
  ctl: { type: Boolean, default: false },
})
const loadedBlog = ref<boolean>(false)
const blogInfo = reactive({
  title: '',
  author: '',
  authorName: '',
  cover: '',
  type: 0,
  createtime: '',
  abstract: '',
  readcount: 0,
  likecount: 0,
  starcount: 0,
})
const blogCoverSrc = ref<string | undefined>(undefined)

const getBlogInfo = async function () {
  let r: any
  if (props.bid) r = await GetBlogsInfoAPI([props.bid])
  if (props.info) r[props.bid as string] = props.info
  console.log(r)
  if (!r)  {
    root.value?.remove()
    return false
  }
  Object.keys(blogInfo).forEach((k) => {
    // @ts-ignore
    r[props.bid][k] ? (blogInfo[k] = r[props.bid][k]) : null
  })
  loadedBlog.value = true
  if (blogInfo.cover) {
    blogCoverSrc.value = store.getters['config/fileUrl'](blogInfo.cover)
  }
  return true
}

const toBlogPage = function () {
  if (!loadedBlog.value) return
  router.push('/b/' + props.bid)
}
const toEditBlog = function () {
  if (
    !props.bid ||
    !loadedBlog.value ||
    store.getters['signin/id'] != blogInfo.author
  )
    return
  router.push({
    name: 'BlogEdit',
    state: { bid: props.bid },
  })
}
const deleteBlog = async function () {
  if (
    !props.bid ||
    !loadedBlog.value ||
    store.getters['signin/id'] != blogInfo.author
  )
    return
  const r = await DeleteBlogAPI(props.bid, props.chunk)
  if (r) {
    root.value?.remove()
    message.success('删除成功')
  }
}
</script>

<style scoped lang="less">
#blogviewlist {
  margin: 0.5rem;
  padding: 1rem 1rem 0 1rem;
  border-radius: var(--borderRadius);
  background-color: var(--colorBgContainer);
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  // box-shadow: var(--boxShadow);

  &:hover {
    background-color: var(--colorPrimaryBg);
  }
  &:hover &-func {
    opacity: 1;
  }

  &-cover {
    img {
      margin-right: 1rem;
      margin-top: 0.2rem;
      height: 8rem;
      width: 12rem;
      background-size: cover cover;
      background-repeat: no-repeat;
      background-position: center;
      object-fit: cover;
      float: left;
      border-radius: var(--borderRadius);
    }
  }

  &-title {
    height: 2.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    div {
      flex-shrink: 0;
      margin: auto 1rem;
      span {
        margin: auto 0.5rem;
      }
    }
  }

  &-info {
    margin: 0.3rem auto;

    span:nth-child(1) ~ * {
      margin-right: 2rem;
      color: var(--colorTextTertiary);
    }
  }

  p {
    min-height: 4rem;
    color: var(--colorTextSecondary);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &-func {
    // margin-top: 1rem;
    opacity: 0;
    text-align: right;
    transition: all 0.1s ease-in-out;
  }
}
</style>
