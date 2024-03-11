import { Provide, Inject } from "@midwayjs/core";
import blogUserModel from "../model/blog.user.model";
import mongoose, { Types } from "mongoose";
import collectionBlogModel from "../model/collection.blog.model";
import { ICollectionCreate } from "../interface/collection.blog.interface";
import { PRIVACY_TYPE } from "../types/privacy.types";
import { ListUtilService } from "./list.util.service";
import { LogService } from "./log.service";

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
      await bu.save({ session })
      await session.commitTransaction()
    } catch (e) {
      this.log.red('initCollections() execution error.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return bu.collections
  }

  /**
   * Get user's collections.
   * @param userid 
   * @returns 
   */
  async getCollections(userid: Types.ObjectId, chunk?: Types.ObjectId): Promise<Array<Types.ObjectId>> {
    const bu = await blogUserModel.model.findById(userid)
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

  }

  /**
   * Create a new collection.
   * @returns id
   */
  async createCollection(options: ICollectionCreate): Promise<Types.ObjectId> {
    return null
  }

  /**
   * Delete a collection.
   * @returns true | false
   */
  async deleteCollection(id: string, uid: string) {

  }

  async appendToCollection() {

  }

  async removeFromCollection() {

  }
}