import { IMiddleware, Middleware } from "@midwayjs/core";
import { NextFunction, Context } from "@midwayjs/koa";
import { debase64WithDate } from "../util/encodeMsg.util";
import { UserIdentityService } from "../service/identity.user.service";
import { UserService } from "../service/base.user.service";
import mongoose from "mongoose";
import { base64 } from "../util/crypto.util";
import { LogService } from "../service/log.service";

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
        id: undefined,        // User ID
        name: undefined,      // User name
        deleted: false,       // User deleted
        token: undefined,     // User token
        tokename: undefined,  // User name in Token
        level: 0,             // User level
        ranks: [],            // User ranks
        overtime: 0,          // Time difference from user request to this service acceptance.
        ipv4: undefined       // User accessing ip
      }
      const id = ctx.request.body['id'] ?? ctx.get('Custom-ID') ?? undefined
      const token = ctx.request.body['token'] ?? ctx.get('Custom-Token') ?? undefined
      const date = ctx.request.body['date'] ?? ctx.get('Custom-Date') ?? undefined

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

            // Get username, level and ranks.
            rawToken = base64.decode(rawToken as string)
            const tokename = (rawToken as string)
              .slice(0, parseInt(
                (rawToken as string).slice(-1), 36
              ))
            const result = await (await ctx.requestContext.getAsync(UserIdentityService)).get(id)
            const username = await (await ctx.requestContext.getAsync(UserService)).getUserInfo(id, ['user', 'deleted'])

            // Set user's name, level, and ranks
            ctx.user['id'] = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : undefined
            ctx.user['name'] = username['user']
            ctx.user['deleted'] = username['deleted']
            ctx.user['tokename'] = tokename
            ctx.user['overtime'] = differDate
            ctx.user['level'] = result.level
            ctx.user['ranks'] = result.ranks
          } catch (e) {
            await (await ctx.requestContext.getAsync(LogService)).red(
              'getUserInfo() execution error. This is middleware.', e)
            break
          } finally {
            break
          }
        }
      }

      // try {
      //   // Set user's ip, and format to ipv4
      //   ctx.user['ipv4'] = /(\d{1,3}.){3}.\d{1,3}/.exec(ctx.ip)[0]
      // } catch { }

      console.log(ctx.user);
      return await next()
    }
  }
}
