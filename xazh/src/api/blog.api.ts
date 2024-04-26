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

export async function GetBlogInfoAPI(bid: string) {
  const result = await xazhAxios.post('/Blog/Get', {
    bid: bid,
  })

  return result.data ? result.data.body : null
}

export async function ReadBlogAPI(bid: string, uid?: string) {
  const result = await xazhAxios.post('/Blog/HadRead', {
    bid: bid,
    uid: uid,
  })

  return result.data ? result.data.body : null
}

export async function LikeBlogAPI(bid: string, v: boolean) {
  const result = await xazhAxios.post('/Blog/Like', {
    bid: bid,
    value: v,
  })

  return result.data ? result.data.body : null
}

export async function StarBlogAPI(bid: string, folder?: string) {
  const result = await xazhAxios.post('/Star/Add', {
    bid: bid,
    folder: folder,
  })

  return result.data ? result.data.body : null
}
export async function UnstarBlogAPI(
  bid: string,
  folder?: string,
  chunk?: string
) {
  const result = await xazhAxios.post('/Star/Unstar', {
    bid: bid,
    folder: folder,
    chunk: chunk,
  })

  return result.data ? result.data.body : null
}

export async function GetBUInteractionAPI(bid: string) {
  const result = await xazhAxios.post('/Blog/GetInteraction', {
    bid: bid,
  })

  return result.data ? result.data.body : null
}
