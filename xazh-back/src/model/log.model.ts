import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId
const name: string = 'Log'

const schema = new mongoose.Schema({
  _id: String,        // Date type. Format to year-month-day
  msgs_LIST: ObjectId
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }