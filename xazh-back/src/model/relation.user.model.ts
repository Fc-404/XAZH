import mongoose from "mongoose";
import { List } from "../service/list.util.service";

const name: string = 'User.Relation'

const schema = new mongoose.Schema({
  follow: List,
  follower: List,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }
