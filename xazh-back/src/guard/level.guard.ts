/**
 * Identify the level
 */

import { Guard, IGuard, getClassMetadata, getPropertyMetadata } from "@midwayjs/core";
import { C_LEVEL_KEY, LEVEL_KEY } from "../decorator/auth/level.decorator";
import { Context } from "@midwayjs/koa";
import { USER_LEVEL } from "../types/userLevel.types";

@Guard()
export class LevelGuard implements IGuard {
  async canActivate(ctx: Context, supplierClz, methodName: string): Promise<boolean> {
    const clevel = getClassMetadata<USER_LEVEL>(C_LEVEL_KEY, supplierClz)
    const level = getPropertyMetadata<USER_LEVEL>(LEVEL_KEY, supplierClz, methodName)
    const userLevel: USER_LEVEL = ctx.user['level'] ?? USER_LEVEL.visitor

    if (level !== undefined) {
      return userLevel >= level ? true : false
    }
    if (clevel !== undefined) {
      return userLevel >= clevel ? true : false
    }

    return false
  }
}