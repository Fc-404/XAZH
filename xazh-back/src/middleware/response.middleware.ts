/**
 * This middleware function is to normalize response.
 */

import { Middleware, IMiddleware, httpError } from "@midwayjs/core"
import { NextFunction, Context } from "@midwayjs/koa"
import { DefaultErrorFilter } from "../filter/default.filter"

@Middleware()
export class NormalizeResponse implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {

      ctx.code = 0
      ctx.status = 200
      ctx.message = 'I know you know I like you.'
      ctx.form = true

      let result = {
        code: ctx.code,
        status: ctx.status,
        message: ctx.message,
        body: ''
      }
      try {
        const body = await next()
        if (ctx.form)
          result.body = body
        else
          result = body
      } catch (error) {
        ctx.logger.error(error)
        ctx.status = 500
        return new httpError.InternalServerErrorError()
      }

      return result
    }
  }
}