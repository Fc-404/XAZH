import { Provide } from "@midwayjs/core";
import blogUserModel from "../model/blog.user.model";
import mongoose, { Types } from "mongoose";
import collectionBlogModel from "../model/collection.blog.model";
import { ICollectionCreate } from "../interface/collection.blog.interface";
import { PRIVACY_TYPE } from "../types/privacy.types";

@Provide()
export class BlogCollectionService {

  /**
   * Get user's collections.
   * @param userid 
   * @returns 
   */
  async getCollections(userid: string | Types.ObjectId): Promise<Array<Types.ObjectId>> {
    const _userid = typeof userid === 'string'
      ? new mongoose.Types.ObjectId(userid) : userid
    const blogUserM = await blogUserModel.model.findById(_userid)

    return blogUserM.collections
  }

  /**
   * Get user's one of collections.
   * Include information about collection and blogs.
   * @param id 
   * @returns 
   */
  async getCollection(id: string | Types.ObjectId): Promise<any> {
    const _id = typeof id === 'string'
      ? new mongoose.Types.ObjectId(id) : id
    const result = await collectionBlogModel.model.findById(_id)

    return result
  }

  /**
   * Create a new collection.
   * @returns id
   */
  async createCollection(options: ICollectionCreate): Promise<string> {
    const coll = await collectionBlogModel.model.create({
      name: options.name,
      author: options.author,
      abstract: options?.abstract ?? '',
      privacy: options?.privacy ?? PRIVACY_TYPE.public
    })
    return coll._id.toString()
  }

  /**
   * Delete a collection.
   * @returns true | false
   */
  async deleteCollection(id: string, uid: string) {
    let result = true
    const _id = new mongoose.Types.ObjectId(id)
    const _uid = new mongoose.Types.ObjectId(uid)
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      await collectionBlogModel.model.deleteOne({ _id: _id }, { session })

      await blogUserModel.model.updateOne({ _id: _uid }, {

      }, { session })

      session.commitTransaction()
    } catch {
      await session.abortTransaction()
      result = false
    } finally {
      session.endSession()
    }

    return result
  }

  async appendToCollection() {

  }

  async removeFromCollection() {

  }
}