<template>
  <div id="blogs">
    <div id="blogs-right">
      <DailyQuoteEn></DailyQuoteEn>
    </div>
    <div id="blogs-list">
      <BlogViewList
        v-for="i in orderBlogInfo"
        :bid="i._id"
        :info="i"
      ></BlogViewList>
      <div style="height: 2rem"></div>
      <a-divider>
        <a-button id="blogs-list-more" type="link" @click="getBlogs">
          {{ orderParam.end ? '没有更多了' : '加载更多' }}
        </a-button>
      </a-divider>
    </div>
    <div id="blogs-left">
      <div id="blogs-left-funs">
        <div class="blogs-fun">
          <a-button
            type="primary"
            shape="circle"
            size="large"
            @click="toEditPage"
          >
            <EditOutlined />
          </a-button>
          <p>编辑博客</p>
        </div>
        <div class="blogs-fun">
          <a-button
            type="primary"
            shape="circle"
            size="large"
            @click="scrollTop"
          >
            <VerticalAlignTopOutlined
              style="font-size: 1.8rem; line-height: 2.8rem"
            />
          </a-button>
          <p>回到顶部</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { PullBlogOrderAPI } from '../../api/pull.api'

const router = useRouter()

const orderBlogInfo = ref<Array<any>>([])
const orderParam = reactive({
  index: 0,
  step: 20,
  end: false,
})

const getBlogs = async function () {
  if (orderParam.end) return
  const r = await PullBlogOrderAPI(orderParam.index, orderParam.step)
  console.log(r)
  if (!r) {
    orderParam.end = true
    console.log(orderParam)
    return
  }
  r?.forEach((v: any) => {
    orderBlogInfo.value.push(v)
  })
  orderParam.index += orderParam.step
}

const scrollTop = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toEditPage = function () {
  router.push({ name: 'BlogEdit' })
}

onMounted(async () => {
  await getBlogs()
})
</script>

<style scoped lang="less">
#blogs {
  display: flex;
  justify-content: center;
  padding: 2rem;

  &-list {
    margin: 0 5rem 0 5rem;
    min-width: 50%;
    max-width: 66rem;

    &-more {
      color: var(--colorPrimary);
      :hover {
        opacity: 0.6;
      }
    }
  }

  &-left {
    &-funs {
      position: fixed;
      bottom: 2rem;

      .blogs-fun {
        width: 5rem;
        margin: 2rem;
        align-items: center;

        button {
          margin-left: 0.9rem;
          height: 3rem;
          width: 3rem;
          font-size: 1.6rem;
          line-height: 1rem;
        }

        p {
          margin-top: 0.6rem;
          text-align: center;
          color: var(--colorTextSecondary);
        }
      }
    }
  }
}
</style>
