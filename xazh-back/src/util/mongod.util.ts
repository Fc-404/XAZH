import {
  Provide, Scope,
  ScopeEnum
} from "@midwayjs/core";

import { ILogger, loggers } from "@midwayjs/logger"
import mongoose from "mongoose";
import mongodConfig from "../config/mongod.config";

@Provide()
@Scope(ScopeEnum.Singleton)
export class Mongod {

  log: ILogger
  conn: typeof mongoose

  constructor() {
    this.log = loggers.getLogger('logger')

    mongoose.connect(mongodConfig.socket()).then((db) => {
      this.conn = db
      this.log.info('数据库连接成功！')
    }).catch((e) => {
      this.log.error('数据库连接失败！\n', e)
    })
  }
}