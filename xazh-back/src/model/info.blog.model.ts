import mongoose, { Schema } from "mongoose";
import { PRIVACY_TYPE } from "../types/privacy.types";
import {List} from "../service/list.util.service";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Blog.Info'

const schema = new mongoose.Schema({
  title: String,
  author: ObjectId,
  privacy: {
    type: Number,
    default: PRIVACY_TYPE.public
  },
  body: ObjectId,
  comments: List,
  type: Number,
  abstract: String,
  createtime: {
    type: Date,
    default: Date.now
  },
  edittime: Date,
  readcount: Number,
  likecount: Number,
  starcount: Number,
  commentcount: Number,
  keyword: [String],
  // TODO
  wordcloud: Object,
  disabled: Boolean,
  deleted: Boolean,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }
