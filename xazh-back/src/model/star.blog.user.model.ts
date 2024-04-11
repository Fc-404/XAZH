import mongoose from "mongoose";
import { List } from "../service/list.util.service";
import { PRIVACY_TYPE } from "../types/privacy.types";

const name: string = 'User.Blog.Star'
const listMax = 1000

const starFolder = new mongoose.Schema({
  name: String,         // name for this favorite, unique key
  description: String,  // descrition for this favorite
  cover: String,        // the fid of picture cover
  privacy: {            // privacy type
    type: Number,
    default: PRIVACY_TYPE.public
  },
  collections: List
})

const schema = new mongoose.Schema({
  list: {
    type: Array,
    of: starFolder,
  }
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model, listMax }
