import { IMiddleware, Inject, Middleware } from "@midwayjs/core";
import { NextFunction } from "@midwayjs/koa";
import { Context } from "koa";
import { debase64WithDate } from "../util/encodeMsg.util";
import { Base64 } from "js-base64";

@Middleware()
export class GetUserIdentity implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.request.body['token'] ?? undefined
      const date = ctx.request.body['date'] ?? undefined
      if (token && date) {
        let rawToken = debase64WithDate({
          date: date, data: token
        })
        if (rawToken) {
          rawToken = Base64.decode(rawToken as string)
          const user = (rawToken as string)
            .slice(0, parseInt(
              (rawToken as string).slice(-1), 36
            ))
        }
      }

      await next()
    }
  }
}