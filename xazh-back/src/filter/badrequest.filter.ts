import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.BadRequestError)
export class BadRequestErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = 400
    
    return {
      code: -1,
      status: 400,
      message: 'Bad Request.',
      type: err.message == 'Bad Request' ? undefined : err.message
    };
  }
}
