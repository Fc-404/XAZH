/**
 * Identify the level
 */

import { Guard, IGuard, getPropertyMetadata } from "@midwayjs/core";
import { USER_KEY } from "../decorator/auth/level.decorator";
import { Context } from "@midwayjs/koa";
import { USER_LEVEL } from "../types/userLevel.types";

@Guard()
export class LevelGuard implements IGuard {
  async canActivate(ctx: Context, supplierClz, methodName: string): Promise<boolean> {
    const level = getPropertyMetadata<USER_LEVEL>(USER_KEY, supplierClz, methodName)

    const userLevel: USER_LEVEL = ctx.user['level'] ?? 0
    if (userLevel >= level)
      return true
    return false
  }
}