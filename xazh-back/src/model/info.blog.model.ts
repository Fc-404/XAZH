import mongoose, { Schema } from "mongoose";
import { PRIVACY_TYPE } from "../types/privacy.types";

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
  comment_like: ObjectId,
  type: String,
  abstract: String,
  createtime: {
    type: Date,
    default: Date.now
  },
  edittime: Date,
  readcount: Number,
  likecount: Number,
  starcount: Number,
  keyword: [String],
  // TODO
  wordcloud: Object,
  disabled: Boolean,
  deleted: Boolean,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }