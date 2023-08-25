import mongoose from 'mongoose'


const name: string = 'ValidCode.Mail'

const schema = new mongoose.Schema({
  _id: String,    // User EMail to be verified.
  code: String,   // valid code.
  data: {         // deadline.
    type: Date,
    default: Date.now
  }
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }