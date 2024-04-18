import {
  Body, Controller, Inject, Post,
  UseGuard
} from "@midwayjs/core";
import { Context } from "koa";
import { MessageService } from "../service/message.service";
import { TokenGuard } from "../guard/token.guard";
import { ObjectId } from "mongodb";

@Controller('/Message')
@UseGuard(TokenGuard)
export class MessageController {
  @Inject()
  ctx: Context
  @Inject()
  msg: MessageService

  @Post('/StartChat')
  async startChat(@Body('uids') uids: string[]) {
    const users = []
    for (let uid of uids)
      if (ObjectId.isValid(uid))
        users.push(new ObjectId(uid))

    const result = await this.msg.startChat(users)
    if (!result) {
      this.ctx.status = 500
    }
    return result
  }

  @Post('/Send')
  async send(@Body('mid') mid: string, @Body('content') content: string,
    @Body('quote') quote?: number, @Body('type') type?: number) {
    if (!ObjectId.isValid(mid)) {
      this.ctx.status = 403
      return false
    }

    const result = await this.msg.sendTo(new ObjectId(mid), {
      uid: this.ctx.user.id, content: content,
      quote: quote, type: type
    })
    if (!result) {
      this.ctx.status = 500
    }
    return result
  }

  @Post('/Get')
  async get(@Body('mid') mid: string, @Body('seq') seq?: number,
    @Body('chunk') chunk?: string) {
    if (!ObjectId.isValid(mid) || (chunk && !ObjectId.isValid(chunk))) {
      this.ctx.status = 403
      return false
    }
    const mId = new ObjectId(mid)
    const result = await this.msg.getMsgs(
      this.ctx.user.id, mId, seq
    )
    if (!result) {
      this.ctx.status = 500
    } else {
      await this.msg.readed(
        this.ctx.user.id, mId, chunk ? new ObjectId(chunk) : undefined
      )
    }
    return result
  }

  @Post('/GetNew')
  async getNew(@Body('chunk') chunk?: string) {
    if (chunk && !ObjectId.isValid(chunk)) {
      this.ctx.code = 403
      return false
    }
    const result = await this.msg.getNewMsgs(
      this.ctx.user.id, chunk ? new ObjectId(chunk) : undefined
    )
    if (!result) {
      this.ctx.status = 500
    }
    return result
  }
}