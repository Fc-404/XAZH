import { IMiddleware, Middleware } from "@midwayjs/core";
import { NextFunction } from "@midwayjs/koa";
import { Context } from "koa";
import { debase64WithDate } from "../util/encodeMsg.util";
import { Base64 } from "js-base64";
import { UserIdentityService } from "../service/identity.user.service";

/**
 * Get user information.
 * Include level and ranks.
 * And then inject into ctx.user.
 */
@Middleware()
export class GetUserInfo implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      ctx.user = {
        name: undefined,
        token: undefined,
        level: 0,
        ranks: [],
        overtime: 0,
        ipv4: undefined
      }
      const token = ctx.request.body['token'] ?? undefined
      const date = ctx.request.body['date'] ?? undefined
      if (token && date) {
        let rawToken = debase64WithDate({
          date: date, data: token
        })

        // Have valid token.
        while (rawToken) {
          try {
            ctx.user['token'] = rawToken
            
            // Get difference of date both client and server.
            const dateNow = new Date().getTime()
            const differDate = (dateNow - new Date(date).getTime()) ?? -1

            // Get user name and then get level and ranks.
            rawToken = Base64.decode(rawToken as string)
            const userIdentityService = await ctx.requestContext.getAsync(UserIdentityService)
            const user = (rawToken as string)
              .slice(0, parseInt(
                (rawToken as string).slice(-1), 36
              ))
            const result = await userIdentityService.get(user)

            // Set user's name, level, and ranks
            ctx.user['name'] = user
            ctx.user['overtime'] = differDate
            ctx.user['level'] = result.level
            ctx.user['ranks'] = result.ranks
          } catch {
            break
          } finally {
            break
          }
        }
      }

      try {
        // Set user's ip, and format to ipv4
        ctx.user['ipv4'] = /(\d{1,3}.){3}.\d{1,3}/.exec(ctx.ip)[0]
      } catch { }

      return await next()
    }
  }
}