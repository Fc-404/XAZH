import mongoose from "mongoose";
import {List} from "../service/list.util.service";

const name: string = 'User.Blog.Star'

// list = {
//   key: blogid,
//   value: {
//     date: Date.now,
//     group: String,
//   }
// }


const schema = new mongoose.Schema({
  group: [String],
  list: List
})

const model = mongoose.model(name, schema, name)

export default {name, schema, model}
