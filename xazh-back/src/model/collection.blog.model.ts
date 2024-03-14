import mongoose, { Schema } from "mongoose";
import { PRIVACY_TYPE } from "../types/privacy.types";
import { List } from "../service/list.util.service";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Blog.Collection'

const schema = new mongoose.Schema({
  name: String,
  abstract: String,
  author: ObjectId,
  privacy: {
    type: Number,
    default: PRIVACY_TYPE.public
  },
  blogs: List,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }