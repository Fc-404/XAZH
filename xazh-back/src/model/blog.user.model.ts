import mongoose, { Schema } from "mongoose"

const ObjectId = Schema.Types.ObjectId

const name: string = 'User.Blog'

const schema = new mongoose.Schema({
  blogs: [ObjectId],        // All blogs of the user.
  collections: [ObjectId],  // All collections of the user.
  read: ObjectId,           // The link of all items that the user has read.
  like: ObjectId,           // The link of all items that the user has like.
  star: ObjectId,           // The link of all items that the user has star.
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }