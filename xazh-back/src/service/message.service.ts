import { Inject, Provide } from "@midwayjs/core";
import { LogService } from "./log.service";
import { ListUtilService } from "./list.util.service";
import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { IMessageBody } from "../interface/message.interface";

import UserMesg from "../model/message.user.model";
import MesgBody from "../model/body.message.model";
import UserBase from "../model/base.user.model";
import { RelationUserService } from "./relation.user.service";

/**
 * Generate a new message id.
 * @param uids 
 * @returns 
 */
const generateId = (uids: Types.ObjectId[]): Types.ObjectId => {
  uids.sort((a, b) => {
    return b.getTimestamp().getTime()
      - a.getTimestamp().getTime()
  })
  return new ObjectId(uids.join())
}

@Provide()
export class MessageService {
  @Inject()
  log: LogService
  @Inject()
  list: ListUtilService
  @Inject()
  rel: RelationUserService

  /**
   * Query message.user.model by uid.
   * @param uid 
   * @returns 
   */
  async getUserMessage(uid: Types.ObjectId) {
    const result = await UserMesg.model.findOneAndUpdate(
      { _id: uid }, {}, { upsert: true, new: true }
    )
    if (!result.msgslist)
      result.msgslist = await this.list.createList()
    if (!result.newmsgs)
      result.newmsgs = await this.list.createList()
    await result.save()
    return result
  }

  /**
   * Start a new chat.
   * @param uids 
   * @returns 
   */
  async startChat(uids: Types.ObjectId[]): Promise<Types.ObjectId> {
    if (uids.length < 2) return undefined
    const mid = generateId(uids)
    if (await UserMesg.model.findById(mid)) return mid

    let msgBody
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const msgList = await this.list.createList(null, session)
      msgBody = await MesgBody.model.create([{
        _id: mid,
        msgs: msgList,
        latest: Date.now(),
      }], { session })
      let userMsg
      for (let uid of uids) {
        if (!!(await UserBase.model.findById(uid))) continue
        msgBody[0].users.push({ id: uid })
        userMsg = await this.getUserMessage(uid)
        await this.list.prependOne(userMsg.msgslist, msgBody[0]._id, session)
      }

      await msgBody[0].save({ session })
      await session.commitTransaction()
    } catch (e) {
      await this.log.red('startChat() execution error in MessageService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return msgBody[0]._id
  }

  /**
   * Sent a message to a chat.
   * @param mid 
   * @param options 
   * @returns 
   */
  async sendTo(mid: Types.ObjectId, options: IMessageBody): Promise<boolean> {
    if (options.uid == 'System') return false
    const msgBody = await MesgBody.model.findById(mid)
    if (!msgBody) return false
    if (!msgBody.users.find(v => v.id == options.uid)) return false
    if (msgBody.users.length == 2) {
      const relation = await this.rel.getInteraction(
        options.uid, options.uid.equals(msgBody.users[0].id) ?
        msgBody.users[1].id : msgBody.users[0].id
      )
      if (relation && relation.isblacked) return false
    }

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const headInfo = await this.list.getHeadInfo(msgBody.msgs)
      if (headInfo.totalLen != msgBody.length) {
        await this.log.yellow('Warning: Sequence in disorder at sendTo() in MessageService.')
        msgBody.length = headInfo.totalLen
      }
      const msg = {
        seq: msgBody.length++,
        uid: options.uid,
        quote: options.quote,
        content: options.content,
        date: Date.now(),
        type: options.type,
      }
      await this.list.appendOne(msgBody.msgs, msg, session)
      msgBody.latest = new Date()
      for (let uid of msgBody.users) {
        if (uid.id == options.uid) continue
        uid.unread++
        let userMsg = await this.getUserMessage(uid.id)
        await this.list.prependOne(userMsg.newmsgs, mid, session)
      }
      await msgBody.markModified('users')
      await msgBody.save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('sendTo() execution error in MessageService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Sent a message to a user by SYSTEM.
   * @param to 
   * @param options 
   */
  async noticeTo(to: Types.ObjectId, body: any): Promise<boolean> {
    const msgBody = await MesgBody.model.findOneAndUpdate(
      { _id: to }, {}, { upsert: true, new: true }
    )
    if (!msgBody) return false

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (!msgBody.msgs)
        msgBody.msgs = await this.list.createList()

      const msg = {
        seq: msgBody.length++,
        body: body,
        date: Date.now(),
      }
      await this.list.prependOne(msgBody.msgs, msg, session)
      msgBody.latest = new Date()
      let u = msgBody.users.find(v => v.id == to)
      if (!u)
        msgBody.users.push({ id: to, unread: 1 })
      else
        u.unread++
      msgBody.markModified('users')
      await msgBody.save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('noticeTo() execution error in MessageService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Get list of new messages.
   * @param uid 
   * @param chunk 
   * @returns 
   */
  async getNewMsgs(uid: Types.ObjectId, chunk?: Types.ObjectId) {
    const userMsg = await this.getUserMessage(uid)
    if (!userMsg) return false

    let result = []
    this.list.foreachList(userMsg.newmsgs, async v => {
      let msgBody = await MesgBody.model.findById(v)
      if (!msgBody) return
      let u = msgBody.users.find(v => v.id == uid)
      result.push({
        mid: msgBody._id,
        unread: u.unread,
        ignore: u.ignore,
        latest: msgBody.latest,
        length: msgBody.length,
      })
    })
    return result
  }

  /**
   * Get message body list by mid and seq.
   * @param uid 
   * @param mid 
   * @param seq 
   * @returns 
   */
  async getMsgs(uid: Types.ObjectId, mid: Types.ObjectId, seq: number = 0) {
    const msgBody = await MesgBody.model.findById(mid)
    if (!msgBody) return false
    if (!msgBody.users.find(v => v.id == uid)) return false

    return this.list.findMany(msgBody.msgs, 0, msgBody.length - seq)
  }

  /**
   * Mark message info to readed.
   * @param uid 
   * @param mid 
   * @param chunk 
   * @returns 
   */
  async readed(uid: Types.ObjectId, mid: Types.ObjectId, chunk?: Types.ObjectId) {
    if (uid.equals(mid)) return false
    const msgBody = await MesgBody.model.findById(mid)
    const userMsg = await UserMesg.model.findById(uid)
    if (!msgBody || !userMsg) return false

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      msgBody.users.find(v => v.id == uid).unread = 0
      msgBody.markModified('users')
      await msgBody.save({ session })
      await this.list.deleteOne(userMsg.newmsgs, v => v.equals(mid), chunk, session)
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('readed() execution error in MessageService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }
}