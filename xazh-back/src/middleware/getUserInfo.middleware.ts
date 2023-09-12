import { IMiddleware, Middleware } from "@midwayjs/core";
import { NextFunction } from "@midwayjs/koa";
import { Context } from "koa";

@Middleware()
export class GetUserInfo implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      
    }
  }
}