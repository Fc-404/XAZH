import mongoose from "mongoose"

const name: string = 'User.Token'

const schema = new mongoose.Schema({
  _id: String,      // User
  token: String,    // User's Token
  date: {
    type: Date,
    default: Date.now,
  },
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }