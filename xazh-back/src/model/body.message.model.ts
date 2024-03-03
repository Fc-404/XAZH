import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Message.Body'

const schema = new mongoose.Schema({
  name: String,           // Msg name
  // TODO
  type: String,           // Msg type
  who: [ObjectId],        // user who join
  msgc: Number,           // Msg counter
  list: [{                // Msg body
    i: Number,                // Index of the msg
    who: ObjectId,            // user who sent msg
    content: String,          // content of msg
    date: {                   // date msg be sent
      type: Date,
      default: Date.now
    },
  }]
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }