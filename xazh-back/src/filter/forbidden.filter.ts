import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.ForbiddenError)
export class ForbiddenErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = 403

    return {
      code: -1,
      status: 403,
      message: 'Forbidden.',
      type: err.message == 'Forbidden' ? undefined : err.message
    };
  }
}
