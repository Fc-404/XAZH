import mongoose from "mongoose";

const name: string = 'Blog.Comment.Countlist'

const schema = new mongoose.Schema({
  likelist: Object,       // Object of users who like comment.
  /**
   * likelist {
   *    key: reply_id,
   *    value: [ObjectId]
   * }
   */
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }