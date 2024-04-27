import { Inject, Provide } from "@midwayjs/core";
import { LogService } from "./log.service";
import mongoose, { Types } from "mongoose";
import { IBlogStarFolder, IBlogStarFolderModfiy } from "../interface/blog.interface";
import { ListUtilService } from "./list.util.service";
import BlogInfo from "../model/info.blog.model";
import UserBlogStar from "../model/star.blog.user.model";
import UserBlogInsteraction from "../model/interaction.blog.user.model";

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
    folders: string[] = ['Default']) {
    const blog = await BlogInfo.model.findById(bid)
    if (!blog) return false
    const blogStar = await this.createFolder(uid, folders.map(v => ({ name: v })))
    if (!blogStar) {
      await this.log.red('star() execution error in StarBlogUserService.')
      return false
    }
    const interaction = await UserBlogInsteraction.model.findOneAndUpdate(
      { _id: uid.toString() + bid.toString() }, {}, { upsert: true, new: true }
    )

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let modified = false
      for (let folder of folders) {
        if (interaction.stars.includes(folder)) continue
        // Add record to whostar
        if (interaction.stars.length <= 0) {
          await this.list.prependOne(blog.whostar, uid, session)
          blog.starcount++
        }
        // Set interaction
        interaction.stars.push(folder)

        // Add blog'id to user's starlist
        await this.list.prependOne(
          blogStar.list.find(v => v.name === folder).collections, bid, session
        )

        modified = true
      }
      if (modified) {
        interaction.markModified('stars')
        await blog.save({ session })
        await interaction.save({ session })
        await session.commitTransaction()
      }
    } catch (e) {
      result = false
      await this.log.red('star() execution error in StarBlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
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
    folders: string[] = ['Default'], chunk?: Types.ObjectId) {
    const blogStar = await UserBlogStar.model.findById(uid)
    if (!blogStar) return false
    const blog = await BlogInfo.model.findById(bid)

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Set interaction
      const interaction = await UserBlogInsteraction.model.findOneAndUpdate(
        { _id: uid.toString() + bid.toString() }, {}, { upsert: true, new: true }
      )

      let modified = false
      for (let folder of folders) {
        if (!interaction.stars.includes(folder)) continue
        // Remove blog'id from user's starlist
        await this.list.deleteOne(
          blogStar.list.find(v => v.name === folder).collections,
          v => bid.equals(v), chunk, session
        )
        // Remove folder from interaction
        interaction.stars = interaction.stars.filter(v => v !== folder)
        modified = true
      }
      if (modified) {
        if (interaction.stars.length <= 0) {
          blog.starcount--
          await blog.save({ session })
        }
        interaction.markModified('stars')
        await interaction.save({ session })
        await session.commitTransaction()
      }
    } catch (e) {
      result = false
      await this.log.red('unstar() execution error in StarBlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Create a new folder.
   * @param uid 
   * @param options 
   * @returns Document | null
   */
  async createFolder(uid: Types.ObjectId, options: IBlogStarFolder[]) {
    const userBlogStar = await UserBlogStar.model.findByIdAndUpdate(uid, {}, { upsert: true, new: true })
    if (userBlogStar.list.length + options.length >= UserBlogStar.listMax) return false

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      for (let folder of options) {
        if (userBlogStar.list.find(v => v.name === folder.name)) continue
        const l = await this.list.createList(UserBlogStar.name + '/list/collections', null, session)
        userBlogStar.list.push({ ...folder, collections: l })
      }
      userBlogStar.markModified('list')
      await userBlogStar.save({ session })

      await session.commitTransaction()
    } catch (e) {
      await this.log.red('createFolder() execution error in StarBlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return userBlogStar
  }

  /**
   * Get user's starlist.
   * @param uid 
   * @returns 
   */
  async getFolders(uid: Types.ObjectId) {
    return UserBlogStar.model.findById(uid).lean()
  }

  /**
   * Get Items from a folder.
   * @param uid 
   * @param folderName 
   * @param chunk 
   * @returns 
   */
  async getItemsByFolder(uid: Types.ObjectId, folderName: string, chunk?: Types.ObjectId) {
    const result = await UserBlogStar.model.findById(uid)
    if (!result) return false
    const item = result.list.find(v => v.name === folderName)
    if (!item) {
      return false
    }
    return this.list.findByChunk(item.collections, chunk)
  }

  /**
   * Delete a folder.
   * @param uid 
   * @param folderName
   * @returns Boolean
   */
  async deleteFolder(uid: Types.ObjectId, folderNames: string[]) {
    const userBlogStar = await UserBlogStar.model.findById(uid)
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      for (let folderName of folderNames) {
        let i = userBlogStar.list.findIndex(v => v.name === folderName)
        if (i < 0) continue
        await this.list.deleteList(userBlogStar.list[i].collections, session)
        userBlogStar.list.splice(i, 1)
        userBlogStar.markModified('list')
      }

      await userBlogStar.save({ session })
      await session.commitTransaction()
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
   * Modify a folder infomations.
   * @param uid 
   * @param options 
   * @returns 
   */
  async modifyFolder(uid: Types.ObjectId, options: IBlogStarFolderModfiy): Promise<boolean> {
    return (await UserBlogStar.model.updateOne(
      { _id: uid, 'list.name': options.name },
      {
        $set: {
          'list.$.name': options.newName,
          'list.$.description': options.description,
          'list.$.cover': options.cover,
          'list.$.privacy': options.privacy
        }
      }
    )).acknowledged
  }
}
