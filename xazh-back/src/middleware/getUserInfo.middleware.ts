import { IMiddleware, Middleware } from "@midwayjs/core";
import { NextFunction } from "@midwayjs/koa";
import { Context } from "koa";
import { debase64WithDate } from "../util/encodeMsg.util";
import { Base64 } from "js-base64";
import { UserIdentityService } from "../service/identity.user.service";
import { UserService } from "../service/base.user.service";
import mongoose from "mongoose";

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

            // Get user name, level and ranks.
            rawToken = Base64.decode(rawToken as string)
            const tokename = (rawToken as string)
              .slice(0, parseInt(
                (rawToken as string).slice(-1), 36
              ))
            const result = await (await ctx.requestContext.getAsync(UserIdentityService)).get(id)
            const username = await (await ctx.requestContext.getAsync(UserService)).getUserInfo(id, ['user', 'deleted'])

            // Set user's name, level, and ranks
            ctx.user['id'] = new mongoose.Types.ObjectId(id)
            ctx.user['name'] = username?.user
            ctx.user['deleted'] = username?.deleted
            ctx.user['tokename'] = tokename
            ctx.user['overtime'] = differDate
            ctx.user['level'] = result.level
            ctx.user['ranks'] = result.ranks
          } catch(e) {
            console.log(e);
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

      console.log(ctx.ip);
      console.log(ctx.user);
      return await next()
    }
  }
}