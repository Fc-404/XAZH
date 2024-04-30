import { xazhAxios } from '../axios/xazh.axios'

export async function PullBlogOrderAPI(
  index?: number,
  step?: number,
  order?: number
) {
  const result = await xazhAxios.post('/Pull/Blog/Order', {
    index: index,
    step: step,
    order: order,
  })

  return result.data
    ? result.data.body.length > 0
      ? result.data.body
      : null
    : null
}
