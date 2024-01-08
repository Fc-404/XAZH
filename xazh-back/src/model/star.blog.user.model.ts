import mongoose from "mongoose";

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
  list: Object
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }