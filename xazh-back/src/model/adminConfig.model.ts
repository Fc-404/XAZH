import mongoose from "mongoose"

const name: string = 'AdminConfig'

const schema = new mongoose.Schema({
  name: String,           // Option's name
  value: Object,          // Option's value
  // TODO
  type: String,           // Option's type
  group: String,          // Option's group
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }