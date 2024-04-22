import {
  Body, Controller, Inject, Post,
  UseGuard
} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { RelationUserService } from "../service/relation.user.service";
import { TokenGuard } from "../guard/token.guard";
import { ObjectId } from "mongodb";


@Controller('/Relation')
@UseGuard(TokenGuard)
export class RelationUserController {
  @Inject()
  ctx: Context
  @Inject()
  rel: RelationUserService

  /**
   * Follow some users.
   * @param users 
   * @returns 
   */
  @Post('/Follow')
  async follow(@Body('users') users: string[]) {
    if (!users) return
    users = typeof users === 'string' ? [users] : users
    let result = []
    for (let user of users) {
      if (!ObjectId.isValid(user)) continue
      let r = await this.rel.follow(this.ctx.user.id, new ObjectId(user))
      result.push({
        user: user,
        status: r
      })
    }
    return result
  }

  /**
   * Unfollow some users.
   * @param users 
   * @param chunks 
   * @returns 
   */
  @Post('/Unfollow')
  async unfollow(@Body('users') users: string[], @Body('chunks') chunks?: any) {
    if (!users) return
    users = typeof users === 'string' ? [users] : users
    let chunksT = chunks ? chunks as { [key: string]: string[] } : null
    let cs = new Array(2)
    let result = []
    for (let user of users) {
      if (!ObjectId.isValid(user)) continue
      if (chunksT && chunksT[user]) {
        cs[0] = ObjectId.isValid(chunksT[user][0]) ?
          new ObjectId(chunksT[user][0]) : undefined
        cs[1] = ObjectId.isValid(chunksT[user][1]) ?
          new ObjectId(chunksT[user][1]) : undefined
      }
      let r = await this.rel.follow(
        this.ctx.user.id, new ObjectId(user),
        false, chunksT ? [cs[0], cs[1]] : undefined
      )
      result.push({
        user: user,
        status: r
      })
    }
    return result
  }

  /**
   * Block or unblock a user.
   * @param user 
   * @param value
   * @returns 
   */
  @Post('/Block')
  async block(@Body('user') user: string, @Body('value') value: boolean = true) {
    if (!user) return
    if (user && !ObjectId.isValid(user)) {
      this.ctx.status = 403
      return false
    }
    let r = await this.rel.blacked(this.ctx.user.id, new ObjectId(user), value)
    return r
  }

  /**
   * Get user interactions with some user .
   * @param users 
   * @returns 
   */
  @Post('/GetInteraction')
  async getInteraction(@Body('users') users: string[]) {
    if (!users) return
    users = typeof users === 'string' ? [users] : users
    let result = []
    for (let user of users) {
      if (!ObjectId.isValid(user)) continue
      let r = await this.rel.getInteraction(this.ctx.user.id, new ObjectId(user))
      result.push({
        user: user,
        status: r
      })
    }
    return result
  }

  /**
   * Get follow list.
   * @param chunk 
   * @returns 
   */
  @Post('/GetFollow')
  async getFollow(@Body('chunk') chunk?: string) {
    if (chunk && !ObjectId.isValid(chunk)) {
      this.ctx.status = 403
      return false
    }
    return await this.rel.getFollowList(this.ctx.user.id,
      chunk ? new ObjectId(chunk) : undefined)
  }

  /**
   * Get follower list.
   * @param chunk 
   * @returns 
   */
  @Post('/GetFollower')
  async getFollower(@Body('chunk') chunk?: string) {
    if (chunk && !ObjectId.isValid(chunk)) {
      this.ctx.status = 403
      return false
    }
    return await this.rel.getFollowerList(this.ctx.user.id,
      chunk ? new ObjectId(chunk) : undefined)
  }
}