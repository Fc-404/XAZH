import mongoose from "mongoose"

const name: string = 'User.Config'

const schema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  pconf: Object,            // User's personal configuration.
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }