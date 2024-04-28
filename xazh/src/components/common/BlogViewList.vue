<template>
  <div id="blogviewlist" :title="bid" @click="toBlogPage">
    <LazyComponent @intersected="getBlogInfo">
      <div id="blogviewlist-title">
        <h2 :title="blogInfo.title" :class="[blogInfo.value ? '' : 'loading']">
          {{ blogInfo.title }}
        </h2>
        <div>
          <span> <EyeOutlined />{{ blogInfo.readcount }}</span>
          <span> <LikeOutlined />{{ blogInfo.likecount }}</span>
          <span> <StarOutlined />{{ blogInfo.starcount }}</span>
        </div>
      </div>
      <div id="blogviewlist-info" :class="[blogInfo.value ? '' : 'loading']">
        <a-tag style="border: none" :color="getBlogTypeColor(blogInfo.type)">
          {{ getBlogTypeName(blogInfo.type) }}
        </a-tag>
        <span>{{ blogInfo.authorName }}</span>
        <span>
          {{
            blogInfo.createtime
              ? formatDate('YYYY-MM-DD hh:mm:ss', new Date(blogInfo.createtime))
              : ''
          }}
        </span>
      </div>
      <p :title="blogInfo.abstract" :class="[blogInfo.value ? '' : 'loading']">
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
const props = defineProps({
  bid: String,
  ctl: { type: Boolean, default: false },
})
const blogInfo = reactive({
  value: false,
  title: '',
  author: '',
  authorName: '',
  type: 0,
  createtime: '',
  abstract: '',
  readcount: 0,
  likecount: 0,
  starcount: 0,
})

const getBlogInfo = async function () {
  if (!props.bid) return
  let r = await GetBlogsInfoAPI([props.bid])
  if (!r) return
  Object.keys(blogInfo).forEach((k) => {
    // @ts-ignore
    r[props.bid][k] ? (blogInfo[k] = r[props.bid][k]) : null
  })
  blogInfo.value = true
}

const toBlogPage = function () {
  router.push('/b/' + props.bid)
}
const toEditBlog = function () {
  if (store.getters['signin/id'] != blogInfo.author) return
  router.push({
    name: 'BlogEdit',
    state: { bid: props.bid },
  })
}
const deleteBlog = async function () {
  if (store.getters['signin/id'] != blogInfo.author || !props.bid) return
  const r = await DeleteBlogAPI(props.bid)
  if (r) {
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
  // box-shadow: var(--boxShadow);

  &:hover {
    background-color: var(--colorPrimaryBg);
  }
  &:hover &-func {
    opacity: 1;
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
