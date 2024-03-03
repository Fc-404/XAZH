import mongoose, { Schema } from "mongoose"

const ObjectId = Schema.Types.ObjectId
const name: string = 'User.Token'

const schema = new mongoose.Schema({
  _id: ObjectId,      // User's ID
  token: String,    // User's Token
  date: {
    type: Date,
    default: Date.now,
  },
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }