import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const name: string = 'User.Blog.Read'

const schema = new mongoose.Schema({
  list: [ObjectId]
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }