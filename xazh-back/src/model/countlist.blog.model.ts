import mongoose from "mongoose";
import {List} from "../service/list.util.service";

const name: string = 'Blog.Countlist'

const schema = new mongoose.Schema({
  wholike: List,
  whostar: List,
})

const model = mongoose.model(name, schema, name)

export default {name, schema, model}
