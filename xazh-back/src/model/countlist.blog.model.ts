import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId
const name: string = 'Blog.Countlist'

const schema = new mongoose.Schema({
  wholike: [ObjectId],
  whostar: [ObjectId],
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }