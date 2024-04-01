/**
 * This service is for user's blog.
 * Not for User.Blog model.
 */

import {Inject, Provide} from "@midwayjs/core";

import {LogService} from "./log.service";
import {ListUtilService} from "./list.util.service";
import {IBlogInfo} from "../interface/blog.interface";
import {Types} from "mongoose";


@Provide()
export class BlogUserService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService;

  async createBlog(options: IBlogInfo) {
  }

  async deleteBlog(id: Types.ObjectId) {
  }

  async editBlog(id: Types.ObjectId, options: IBlogInfo) {
  }

  async getBlogInfo(id: Types.ObjectId) {
  }

  async getBlogBody(id: Types.ObjectId) {
  }

  async read(id: Types.ObjectId, uid: Types.ObjectId) {
  }

  async like(id: Types.ObjectId, uid: Types.ObjectId, value: boolean = true) {
  }

  async star(id: Types.ObjectId, uid: Types.ObjectId, value: boolean = true) {
  }

  async disable(id: Types.ObjectId) {
  }
}
