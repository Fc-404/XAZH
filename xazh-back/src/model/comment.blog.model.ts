import mongoose, { Schema } from "mongoose";
import { List } from "../service/list.util.service";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Blog.Comment'

const schema = new mongoose.Schema({
  // common
  bid: ObjectId,        // blog id
  author: ObjectId,     // comment's auther
  date: {
    type: Date,
    default: Date.now,
  },
  atwho: [ObjectId],    // the list of user who be at
  content: String,      // comment content
  likecount: {          // like counter
    type: Number,
    default: 0
  },
  wholike: List,        // the list of user who like this comment
  // special
  cid: ObjectId,        //- comment id, only used to reply main comment
  replywho: ObjectId,   //- the user who be reply, only used to reply in main comment
  subcomments: List,    //+ the list of subcomment, only used in main comment
  subcount: {           //+ the counter of subcomment, only used in main comment
    type: Number,
    default: 0
  },
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }