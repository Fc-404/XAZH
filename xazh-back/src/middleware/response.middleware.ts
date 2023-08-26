/**
 * This middleware function is to normalize response.
 */

import { Middleware, IMiddleware } from "@midwayjs/core"
import { NextFunction, Context } from "@midwayjs/koa"

@Middleware()
export class NormalizeResponse implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {

      ctx.code = 0
      ctx.status = 200
      ctx.message = 'I know you know I like you.'
      ctx.html = false

      const result = await next()

      return ctx.html ? result : {
        code: ctx.code,
        status: ctx.status,
        message: ctx.message,
        body: result ?? ''
      }

    }
  }
}