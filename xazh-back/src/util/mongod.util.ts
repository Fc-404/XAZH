/**
 * To connect Database within MongoDB.
 */

import { Provide, Scope, ScopeEnum } from '@midwayjs/core'
import { ILogger, loggers } from '@midwayjs/logger'
import mongoose from 'mongoose'
import mongodConfig from '../config/mongod.config'

@Provide()
@Scope(ScopeEnum.Singleton)
export class Mongod {
  log: ILogger
  conn: typeof mongoose

  constructor() {
    this.log = loggers.getLogger('logger')

    mongoose.connection.on('connected', () => {
      this.log.info('数据库连接成功！')
    })
    mongoose.connection.on('disconnected', () => {
      this.log.error('数据库断开连接！')
      setTimeout(() => {
        this.log.info('正在尝试重新连接数据库！')
        connMongod()
      }, 3000)
    })

    const connMongod = () => {
      mongoose.connect(mongodConfig.socket())
    }
    connMongod()
  }
}
