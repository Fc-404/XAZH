import { Inject, Provide, ILogger } from "@midwayjs/core";
import { Context } from "koa";
import Log from '../model/log.model'
import { Types } from "mongoose";
import { formatDate } from "../util/formatDate.util";
import { ListUtilService } from "./list.util.service";

@Provide()
export class LogService {
  @Inject()
  ctx: Context

  @Inject()
  list: ListUtilService

  @Inject()
  logger: ILogger

  /**
   * Append msg to DB.
   * @param msg
   */
  private async append(msg: string) {
    const logid = formatDate('YYYYMMDD')
    let log = await Log.model.findById(logid)
    if (!log) {
      const list = await this.list.createList(Log.name + '/msgs')
      log = await Log.model.create({
        _id: logid,
        msgs: list,
      })
    }
    const listid = new Types.ObjectId(log.msgs)
    await this.list.appendOne(listid, msg)
  }

  /**
   * Red information.
   * Means error.
   * @param msg
   * @param info
   */
  async red(msg, info: any = true) {
    info = info === true
      ? new Error().stack.slice(6) : info
    let str = `[red][${formatDate('YYYY-MM-DD hh:mm:ss')}][${this.ctx.ip}][${this.ctx.user['id']}] ${msg}\
              \n${info.stack}`
    this.error(str)
    await this.append(str)
  }

  /**
   * Yellow information.
   * Means warning.
   * @param msg
   * @param info
   */
  async yellow(msg, info: any = true) {
    info = info === true
      ? new Error().stack.slice(6) : info
    let str = `[yellow][${formatDate('YYYY-MM-DD hh:mm:ss')}][${this.ctx.ip}][${this.ctx.user['id']}] ${msg}\
              \n${info.stack}`
    this.warn(str)
    await this.append(str)
  }

  /**
   * Green information.
   * Means safe.
   * @param msg
   * @param info
   */
  async green(msg, info: any = false) {
    info = info === info
      ? new Error().stack.slice(6) : null
    let str = `[green][${formatDate('YYYY-MM-DD hh:mm:ss')}][${this.ctx.ip}][${this.ctx.user['id']}] ${msg}\
              \n${info.stack}`
    this.info(str)
    await this.append(str)
  }

  /**
   * Get log that in a chunk.
   * @param date
   * @param chunk
   * @returns
   */
  async get(date, chunk?: Types.ObjectId) {
    let result
    let log = await Log.model.findById(date, { msgs: 1 })
    if (chunk) {
      result = await this.list.findByChunk(log.msgs, chunk)
    } else {
      result = await this.list.findByNode(log.msgs, 0)
    }
    return result
  }

  info(msg, ...args) { this.logger.info('\n' + msg, ...args) }
  warn(msg, ...args) { this.logger.warn('\n' + msg, ...args) }
  error(msg, ...args) { this.logger.error('\n' + msg, ...args) }
  debug(msg, ...args) { this.logger.debug('\n' + msg, ...args) }
}
