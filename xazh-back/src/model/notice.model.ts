import mongoose from "mongoose";

const name: string = 'Notice'

const schema = new mongoose.Schema({
  title: String,
  date: {
    type: Date,
    default: Date.now
  },
  // TODO type
  type: String,
  content: String
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }