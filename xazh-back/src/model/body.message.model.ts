import mongoose, { Schema } from "mongoose";
import { List } from "../service/list.util.service";

const ObjectId = Schema.Types.ObjectId
const name: string = 'Message.Body'

/*
const msgsType = {
  seq: Number,                // Index of the msg
  uid: Types.ObjectId,        // user who sent msg
  quote: Number,              // index of the msg which be quoted
  content: String,            // content of msg
  date: Date,                 // date msg be sent
  type: Number,               // Msg type
}
*/

const user = {
  _id: false,
  id: ObjectId,
  unread: {
    type: Number,
    default: 0,
  },
  ignore: {
    type: Boolean,
    default: false,
  },
}

const schema = new mongoose.Schema({
  _id: String,
  msgs: List,
  users: {
    type: Array,
    of: user,
  },
  latest: Date,
  length: {
    type: Number,
    default: 0
  },
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }