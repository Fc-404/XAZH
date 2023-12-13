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
      ctx.form = true

      try {
        const body = await next()

        let result = {
          code: ctx.code,
          status: ctx.status,
          message: ctx.message,
          body: body
        }

        if (!ctx.form)
          result = body

        return result
      } catch (error) {
        ctx.logger.error(error)
        throw error
      }
    }
  }
}