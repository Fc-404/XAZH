import { Inject, Provide } from "@midwayjs/core";
import { LogService } from "./log.service";
import mongoose, { Types } from "mongoose";
import { IBlogStarFolder, IBlogStarFolderModfiy } from "../interface/blog.interface";
import { ListUtilService } from "./list.util.service";
import UserBlogStar from "../model/star.blog.user.model";

@Provide()
export class StarBlogUserService {

  @Inject()
  log: LogService
  @Inject()
  list: ListUtilService

  /**
   * Star a blog.
   * @param uid 
   * @param bid 
   * @param folder 
   * @returns 
   */
  async star(uid: Types.ObjectId, bid: Types.ObjectId,
    folder: string = 'Default') {
    const result = await this.createFolder(uid, { name: folder })
    if (!result) {
      await this.log.red('star() execution error in StarBlogUserService.')
      return false
    }
    return this.list.prependOne(result.collectionId, bid)
  }

  /**
   * Unstar a blog.
   * @param uid 
   * @param bid 
   * @param folder 
   * @param chunk 
   * @returns 
   */
  async unstar(uid: Types.ObjectId, bid: Types.ObjectId,
    folder: string = 'Default', chunk?: Types.ObjectId) {
    const result = await this.createFolder(uid, { name: folder })
    if (!result) {
      await this.log.red('unstar() execution error in StarBlogUserService.')
      return false
    }
    return this.list.deleteOne(result.collectionId, bid, chunk)
  }

  /**
   * Create a new folder.
   * @param uid 
   * @param options 
   * @returns Document | null
   */
  async createFolder(uid: Types.ObjectId, options: IBlogStarFolder) {
    const userBlogStar = await UserBlogStar.model.findById(uid, null, { upsert: true })
    let folder = userBlogStar.list.find(v => v.name === options.name)
    let result = {
      userBlogStar: userBlogStar,
      collectionId: null,
    }
    if (folder) {
      result.collectionId = folder.collections
      return result
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (userBlogStar.list.length >= UserBlogStar.listMax)
        throw 'List is full. Max length is' + UserBlogStar.listMax
      const l = this.list.createList(null, session)
      userBlogStar.list.push({ ...options, collections: l })
      userBlogStar.markModified('list')
      userBlogStar.save({ session })
      await session.commitTransaction()
      result.collectionId = l
    } catch (e) {
      result = null
      await this.log.red('createFolder() execution error in StarBlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Delete a folder.
   * @param uid 
   * @param folderName
   * @returns Boolean
   */
  async deleteFolder(uid: Types.ObjectId, folderName: string) {
    const userBlogStar = await UserBlogStar.model.findById(uid)
    const index = userBlogStar.list.findIndex(v => v.name === folderName)
    if (index < 0) return true
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.deleteList(userBlogStar.list[index].collections, session)
      userBlogStar.list.splice(index, 1)
      userBlogStar.markModified('list')
      userBlogStar.save({ session })
    } catch (e) {
      result = false
      await this.log.red('deleteFolder() execution error in StarBlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Modfiy a folder infomations.
   * @param uid 
   * @param options 
   * @returns 
   */
  async modfiyFolder(uid: Types.ObjectId, options: IBlogStarFolderModfiy) {
    return UserBlogStar.model.updateOne(
      { _id: uid },
      {
        $set: {
          'list.$[element].name': options.name,
          'list.$[element].description': options.description,
          'list.$[element].cover': options.cover,
          'list.$[element].privacy': options.privacy,
        }
      },
      {
        'arrayFilters': [
          { 'element.name': options.oldName }
        ]
      }
    )
  }
}
