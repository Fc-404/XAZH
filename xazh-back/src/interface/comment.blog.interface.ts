import {Types} from "mongoose";

export interface ICommentBlog {
  id: Types.ObjectId,     // comment_link in blog.info
  uid: Types.ObjectId,    // author
  content: string,        // content
}

export interface ICommentToBlog extends ICommentBlog {
  cid: Types.ObjectId,    // comment's id in comments.
}
