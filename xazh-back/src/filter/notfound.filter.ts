import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = 404

    return {
      status: 404,
      message: 'Not found.',
    }
  }
}
