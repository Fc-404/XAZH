import mongoose from "mongoose";

const name: string = 'User.Blog.Interaction'

const commentSchema = {
  islike: Boolean,
}

const schema = new mongoose.Schema({
  _id: String,             // User id, that is userid+blogid
  islike: Boolean,         // Whether like
  stars: [String],         // Which folders are star blog.
  comment: {
    type: Object,
    of: commentSchema,
    default: {}
  }
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model } 
