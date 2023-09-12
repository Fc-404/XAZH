/**
 * Identify the ranks
 */

import { Guard, IGuard, getPropertyMetadata } from "@midwayjs/core";
import { USER_KEY } from "../decorator/auth/ranks.decorator";
import { Context } from "@midwayjs/koa";

@Guard()
export class RanksGuard implements IGuard {
  async canActivate(ctx: Context, supplierClz, methodName: string): Promise<boolean> {
    const rankNameList = getPropertyMetadata<string[]>(USER_KEY, supplierClz, methodName)
    if (rankNameList && rankNameList.length && ctx.user.rank) {
      return rankNameList.includes(ctx.user.rank)
    }
    return false
  }
}