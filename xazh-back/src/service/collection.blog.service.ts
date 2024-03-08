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
  async getCollections(userid :Types.ObjectId): Promise<Array<Types.ObjectId>> {
    return null
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