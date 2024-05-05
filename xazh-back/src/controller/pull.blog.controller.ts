import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { BlogUserService } from '../service/blog.user.service'
import { Context } from '@midwayjs/koa'
import { PRIVACY_TYPE } from '../types/privacy.types'

@Controller('/Pull')
export class PullController {
  @Inject()
  ctx: Context
  @Inject()
  blog: BlogUserService

  @Post('/Blog/Order')
  async function(
    @Body('index') index: number,
    @Body('step') step: number,
    @Body('order') order?: boolean
  ) {
    if (index < 0 || step < 0) {
      this.ctx.status = 422
      return false
    }
    const uid = this.ctx.user.uid ?? null
    const result = []
    const blogs = await this.blog.getBlogsByOrder(index, step, order)
    blogs?.forEach((v) => {
      switch (v.privacy) {
        case PRIVACY_TYPE.public:
          result.push(v)
          break
        case PRIVACY_TYPE.followers:
        case PRIVACY_TYPE.onlyfriend:
        case PRIVACY_TYPE.onlyself:
          if (uid && uid.equals(v.author)) result.push(v)
          break
      }
    })

    return result
  }
}
