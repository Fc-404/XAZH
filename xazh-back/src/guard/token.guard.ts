/**
 * Verify the consistency of token and the token timeliness of token.
 */

import { Guard, IGuard } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { UserTokenService } from "../service/token.user.service";

const overtimeMax: number = 30000

@Guard()
export class TokenGuard implements IGuard {
  async canActivate(ctx: Context): Promise<boolean> {
    // ! Develop
    let timeout: boolean = true
    let identicalUser: boolean = false
    let identicalToken: boolean = false

    if (ctx.user['overtime'] <= overtimeMax
      && ctx.user['overtime'] >= 0)
      timeout = true

    if (ctx.user['name'] == ctx.request.body['user'])
      identicalUser = true

    // Verify the token correctness.
    const tokenService = await ctx.requestContext.getAsync(UserTokenService)
    identicalToken = await tokenService.verifyToken(
      ctx.user['name'], ctx.user['token']
    )
    
    return (timeout && identicalUser && identicalToken)
  }
}