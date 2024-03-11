import mongoose from "mongoose";
import { List } from "../service/list.util.service";

const name: string = 'Log'

const schema = new mongoose.Schema({
  _id: String,        // Date type. Format to year-month-day
  msgs: List
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }