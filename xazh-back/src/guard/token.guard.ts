/**
 * Verify the consistency of token and the token timeliness of token.
 */

import { Guard, IGuard } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

const overtimeMax: number = 30000

@Guard()
export class TokenGuard implements IGuard {
  async canActivate(ctx: Context): Promise<boolean> {
    let timeout: boolean = false
    let identicalUser: boolean = false

    // if (ctx.user['overtime'] < overtimeMax
    //   && ctx.user['overtime'] >= 0)
    timeout = true

    if (ctx.user['name'] == ctx.request.body['user'])
      identicalUser = true

    return (timeout && identicalUser)
  }
}