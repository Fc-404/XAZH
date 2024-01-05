import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId
const name: string = 'User.Blog.Read'

const schema = new mongoose.Schema({
  list: [ObjectId]
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }