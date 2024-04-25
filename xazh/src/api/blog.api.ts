import { xazhAxios } from '../axios/xazh.axios'

/**
 * Publish Blog
 * @param param
 * @returns
 */
export async function PublishBlog(param: object) {
  const result = await xazhAxios.post('/Blog/Publish', param)
  return {
    code: result.data?.code,
    body: result.data?.body,
  }
}

export async function GetBlogInfo(bid: string) {
  const result = await xazhAxios.post('/Blog/Get', {
    bid: bid,
  })

  return result.data ? result.data.body : null
}
