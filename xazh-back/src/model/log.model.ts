import mongoose from "mongoose";

const name: string = 'Log'

const schema = new mongoose.Schema({
  _id: String,        // Date type. Format to year-month-day
  msgs: [{
    time: {
      type: Date,
      default: Date.now
    },
    msg: String,
    type: String,
  }]
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }