import {Types} from "mongoose";

export interface ICommentBlog {
  bid: Types.ObjectId,    // blog's id
  uid: Types.ObjectId,    // author
  content: string,        // content
}

export interface ICommentToBlog extends ICommentBlog {
  cid: string,                // comment's id in comments.
  replywho?: Types.ObjectId,  // who be reply
}
