import { Inject, Provide } from "@midwayjs/core";
import { LogService } from "./log.service";
import { ListUtilService } from "./list.util.service";
import mongoose, { Types } from "mongoose";

import UserRel from "../model/relation.user.model"
import UserRelInteraction from "../model/interaction.relation.user.model"

@Provide()
export class RelationUserService {
  @Inject()
  log: LogService
  @Inject()
  list: ListUtilService

  /**
   * To follow or unfollow a user.
   * @param from 
   * @param to 
   * @param value
   * @param chunks
   * @returns boolean
   */
  async follow(from: Types.ObjectId, to: Types.ObjectId,
    value: boolean = true, chunks?: Types.ObjectId[]): Promise<boolean> {
    if (from.equals(to)) return false
    const interactionId = UserRelInteraction.generateId(from, to)
    const interaction = await UserRelInteraction.model.findOne(
      { _id: interactionId.id }, null, { upsert: true }
    )
    const fromRel = await UserRel.model.findById(from)
    const toRel = await UserRel.model.findById(to)
    if (!fromRel || !toRel) return false

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // update interaction between two users
      if (interactionId.reverse) {
        interaction.followertime = new Date()
        interaction.isfollower = value ? true : false
      } else {
        interaction.followtime = new Date()
        interaction.isfollow = value ? true : false
      }
      await interaction.save({ session })

      // update relation list
      if (!fromRel.follow)
        fromRel.follow = await this.list.createList(null, session)
      if (!toRel.follower)
        toRel.follow = await this.list.createList(null, session)

      if (value) {
        await this.list.prependOne(fromRel.follow, to, session)
        await this.list.prependOne(toRel.follower, from, session)
      } else {
        await this.list.deleteOne(fromRel.follow, v => to.equals(v), chunks[0], session)
        await this.list.deleteOne(toRel.follower, v => from.equals(v), chunks[1], session)
      }

      await fromRel.save({ session })
      await toRel.save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('follow() execution error in RelationUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Add or del a user in blacklist.
   * @param from 
   * @param to 
   */
  async blacked(from: Types.ObjectId, to: Types.ObjectId, value: boolean = true) {
    if (from.equals(to)) return false
    const interactionId = UserRelInteraction.generateId(from, to)
    const interaction = await UserRelInteraction.model.findOne(
      { _id: interactionId.id }, null, { upsert: true }
    )

    let index = interaction.blacklist.indexOf(to)
    if (value) {
      index == -1 ? interaction.blacklist.push(to) : null
    } else {
      index != -1 ? interaction.blacklist.splice(index, 1) : null
    }
    const result = await interaction.save()
    return result ? true : false
  }

  /**
   * Get interaction information between two users.
   * @param from 
   * @param to 
   */
  async getInteraction(from: Types.ObjectId, to: Types.ObjectId) {
    if (from.equals(to)) return false
    const interactionId = UserRelInteraction.generateId(from, to)
    const result = await UserRelInteraction.model.findById(interactionId.id)
    return {
      followtime: interactionId.reverse ?
        result.followertime : result.followtime,
      followertime: interactionId.reverse ?
        result.followtime : result.followertime,
      isfollow: interactionId.reverse ?
        !!!(result?.isfollow) : !!(result?.isfollow),
      isfollower: interactionId.reverse ?
        !!!(result?.isfollower) : !!(result?.isfollower),
      isblack: result.blacklist.indexOf(to) != -1 ?
        true : false,
      isblacked: result.blacklist.indexOf(from) != -1 ?
        true : false
    }
  }

  /**
   * Get the list of users that the current user follows.
   * @param uid 
   * @param chunk 
   * @returns 
   */
  async getFollowList(uid: Types.ObjectId, chunk?: Types.ObjectId) {
    const userRel = await UserRel.model.findById(uid)
    return this.list.findByChunk(userRel.follow, chunk)
  }

  /**
   * Get the list of users who follow the current user.
   * @param uid 
   * @param chunk 
   * @returns 
   */
  async getFollowerList(uid: Types.ObjectId, chunk?: Types.ObjectId) {
    const userRel = await UserRel.model.findById(uid)
    return this.list.findByChunk(userRel.follower, chunk)
  }
}