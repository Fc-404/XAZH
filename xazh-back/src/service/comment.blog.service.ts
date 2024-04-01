import {Inject, Provide} from "@midwayjs/core";
import {ListUtilService} from "./list.util.service";
import {LogService} from "./log.service";
import {Types} from "mongoose";
import {ICommentBlog, ICommentToBlog} from "../interface/comment.blog.interface";

@Provide()
export class CommentBlogService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService

  async initComment() {
  }

  async getComments(id: Types.ObjectId, chunk?: Types.ObjectId) {
  }

  async reply(options: ICommentBlog) {

  }

  async replyTo(options: ICommentToBlog) {
  }

  async deleteComment(id: Types.ObjectId, cid: Types.ObjectId) {

  }

  async like(id: Types.ObjectId, uid: Types.ObjectId, value: boolean = true) {

  }
}
