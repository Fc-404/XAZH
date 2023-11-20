import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.status = 500
    // 所有的未分类错误会到这里
    return {
      status: 500,
      message: 'Unknown error.',
      body: err
    };
  }
}
