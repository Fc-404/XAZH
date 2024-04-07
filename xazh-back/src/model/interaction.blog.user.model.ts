import mongoose from "mongoose";

const name: string = 'User.Blog.Interaction'

const commentSchema = new mongoose.Schema({
  islike: Boolean,
})

const schema = new mongoose.Schema({
  _id: String,             // User id, that is userid+blogid
  islike: Boolean,         // Whether like
  isstar: Boolean,         // Whether star
  comment: {
    type: Map,
    of: commentSchema,
    default: new Map()
  }
})

const model = mongoose.model(name, schema, name)

export default {name, schema, model}
