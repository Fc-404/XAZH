import { xazhAxios } from '../axios/xazh.axios'

export async function PublishBlog(param: object) {
  const result = await xazhAxios.post('/Blog/Publishs', param)

  return {
    code: result.data.code,
    body: result.data.body,
  }
}
