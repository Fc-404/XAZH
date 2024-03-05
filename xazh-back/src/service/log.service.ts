import { Inject, Provide } from "@midwayjs/core";
import Log from '../model/log.model'
import { Types } from "mongoose";
import { formatDate } from "../util/formatDate.util";
import { ListUtilService } from "./list.util.service";

@Provide()
export class LogService {
  @Inject()
  list: ListUtilService

  /**
   * Append msg to DB.
   * @param msg 
   */
  private async append(msg: string) {
    const logid = formatDate('YYYYMMDD')
    let log = await Log.model.findById(logid)
    if (!log) {
      const list = await this.list.createList()
      log = await Log.model.create({
        _id: logid,
        msgs_LIST: list,
      })
    }
    const listid = new Types.ObjectId(log.msgs_LIST)
    await this.list.appendOne(listid, msg)
  }

  /**
   * Red information.
   * Means error.
   * @param msg 
   * @param callerinfo 
   */
  async red(msg, callerinfo: boolean = true) {
    const caller = callerinfo
      ? '\n\t' + new Error().stack?.split('\n')[2]?.trim() : null
    let str = `[red][${formatDate('YYYY-MM-DD hh:mm:ss')}] ${msg}\
                ${caller}`
    await this.append(str)
  }

  /**
   * Yellow information.
   * Means warning.
   * @param msg 
   * @param callerinfo 
   */
  async yellow(msg, callerinfo: boolean = true) {
    const caller = callerinfo
      ? '\n\t' + new Error().stack?.split('\n')[2]?.trim() : null
    let str = `[yellow][${formatDate('YYYY-MM-DD hh:mm:ss')}] ${msg}\
              ${caller}`
    await this.append(str)
  }

  /**
   * Green information.
   * Means safe.
   * @param msg 
   * @param callerinfo 
   */
  async green(msg, callerinfo: boolean = false) {
    const caller = callerinfo
      ? '\n\t' + new Error().stack?.split('\n')[2]?.trim() : null
    let str = `[green][${formatDate('YYYY-MM-DD hh:mm:ss')}] ${msg}\
              ${caller}`
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
    if (chunk) {
      result = await this.list.findByChunk(chunk)
    } else {
      let log = await Log.model.findById(date, { msgs_LIST: 1 })
      result = await this.list.findByNode(log.msgs_LIST, 0)
    }
    return result
  }
}
