import {Provide, Inject} from "@midwayjs/core";
import mongoose, {Types} from "mongoose";
import UserBlog from "../model/blog.user.model";
import BlogColl from "../model/collection.blog.model";
import {ICollectionCreate} from "../interface/collection.blog.interface";
import {ListUtilService} from "./list.util.service";
import {LogService} from "./log.service";

@Provide()
export class BlogCollectionService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService

  /**
   * Init collections.
   */
  async initCollections(bu: any): Promise<any> {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (!bu.collections)
        bu.collections = await this.list.createList(null, session)
      await bu.save({session})
      await session.commitTransaction()
    } catch (e) {
      await this.log.red('initCollections() execution error.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return bu.collections
  }

  /**
   * Get user's collections.
   * @param userid
   * @param chunk
   * @returns
   */
  async getCollections(userid: Types.ObjectId, chunk?: Types.ObjectId): Promise<Array<Types.ObjectId>> {
    const bu = await UserBlog.model.findById(userid)
    if (bu && !bu.collections)
      await this.initCollections(bu)

    let result
    if (chunk)
      result = await this.list.findByChunk(bu.collections, chunk)
    else
      result = await this.list.findByNode(bu.collections, 0)

    return result
  }

  /**
   * Get user's one of collections.
   * Include information about collection and blogs.
   * @param id
   * @returns
   */
  async getCollection(id: Types.ObjectId): Promise<any> {
    return BlogColl.model.findById(id);
  }

  /**
   * Create a new collection.
   * @returns id
   */
  async createCollection(userid: Types.ObjectId, options: ICollectionCreate): Promise<Types.ObjectId> {
    let result = null
    const bu = await UserBlog.model.findById(userid)
    if (bu && !bu.collections)
      await this.initCollections(bu)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const listid = await this.list.createList(null, session)
      const collection = await BlogColl.model.create([{
        name: options.name,
        abstract: options.abstract,
        author: userid,
        privacy: options.privacy,
        blogs: listid
      }], {session})
      await this.list.appendOne(bu.collections, collection[0]._id, session)
      await session.commitTransaction()
      result = collection[0]._id
    } catch (e) {
      await this.log.red('createCollection() execution error.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Delete a collection.
   * @returns true | false
   */
  async deleteCollection(uid: Types.ObjectId, cid: Types.ObjectId, chunk?: Types.ObjectId): Promise<boolean> {
    let result = true
    const bu = await UserBlog.model.findById(uid)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      result = await this.list.deleteOne(bu.collections, cid, chunk, session)
      if (!result)
        throw new Error('Can not delete the collection in deleteCollection().')
      await BlogColl.model.deleteOne({_id: cid}, {session})
      result = true
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('deleteCollection() execution error.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Append a blog to collection.
   * @param uid user's id
   * @param cid collection's id
   * @param bid blog's id
   * @returns
   */
  async appendToCollection(uid: Types.ObjectId, cid: Types.ObjectId, bid: Types.ObjectId): Promise<boolean> {
    let result = true
    const bc = await BlogColl.model.findById(cid)
    if (!uid.equals(bc.author)) {
      await this.log.yellow(`Refuse operation in appendToCollection(),\
        because user ${uid} want to append one item to collection ${cid} belong to ${bc.author}`)
      return false
    }

    result = await this.list.appendOne(bc.blogs, bid)

    return result
  }

  /**
   * Remove a blog from collection.
   * @param uid user's id
   * @param cid collection's id
   * @param bid blog's id
   * @param chunk from what chunk
   * @returns
   */
  async removeFromCollection(uid: Types.ObjectId, cid: Types.ObjectId, bid: Types.ObjectId, chunk?: Types.ObjectId) {
    let result = true
    const bc = await BlogColl.model.findById(cid)
    if (!uid.equals(bc.author)) {
      await this.log.yellow(`Refuse operation in removeFromCollection(),\
        because user ${uid} want to remove one item from collection ${cid} belong to ${bc.author}`)
      return false
    }

    result = await this.list.deleteOne(bc.blogs, bid, chunk)

    return result
  }
}
