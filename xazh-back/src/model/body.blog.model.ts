import mongoose from "mongoose";

const name: string = 'Blog.Body'

const schema = new mongoose.Schema({
  content: String,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }