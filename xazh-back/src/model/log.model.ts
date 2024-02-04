import mongoose from "mongoose";

const name: string = 'Log'

const msgsSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now
  },
  msg: String,
  type: String,
})
const schema = new mongoose.Schema({
  _id: String,        // Date type. Format to year-month-day
  msgs: [msgsSchema]
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }