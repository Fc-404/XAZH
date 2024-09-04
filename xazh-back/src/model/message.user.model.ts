import mongoose from "mongoose";
import { List } from "../service/list.util.service";

const name: string = 'User.Message'

const schema = new mongoose.Schema({
  msgslist: List,
  newmsgs: List,
  pinned: Array,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }