import { Provide, Scope, ScopeEnum } from "@midwayjs/core"
import connConfig from "../config/config.mongod"
import mongoose, { Mongoose } from "mongoose"

import { ILogger, loggers } from "@midwayjs/logger"

export type connType = mongoose.Connection
export class Schema extends mongoose.Schema { }

@Provide()
@Scope(ScopeEnum.Singleton)
export class Mongod {

    private log: ILogger

    private conn: mongoose.Mongoose
    private isConnection: boolean = false
    private connRetryCount: number = 0

    constructor() {
        this.log = loggers.getLogger('logger')
        mongoose.connection.once('open', () => {
            this.log.info('数据库连接成功！')
            this.isConnection = true
            this.connRetryCount = 0
        })
        mongoose.connection.once('close', () => {
            this.log.error('数据库连接失败！')
            this.isConnection = false
            this.connRetryCount++
            setTimeout(this.toConn, 1000)
        })
        this.toConn()
    }

    async toConn() {
        if (this.connRetryCount)
            this.log.warn(`第${this.connRetryCount}次尝试连接数据库中...`)
        this.conn = await mongoose.connect(connConfig.socket(), connConfig.connOption)
    }

    async newConn(db: string) {
        return await mongoose.createConnection(connConfig.socket(db))
    }

    getConn() {
        return this.isConnection ? this.conn : null
    }

    public static getMongoose(): Mongoose {
        return mongoose
    }
}