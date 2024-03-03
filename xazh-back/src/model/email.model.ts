import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Email'

const schema = new mongoose.Schema({
  from: ObjectId,
  to: ObjectId,
  content: String,
  // TODO
  type: String,
  date: {
    type: Date,
    default: Date.now
  }
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }