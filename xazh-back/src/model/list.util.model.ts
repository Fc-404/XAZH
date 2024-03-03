import mongoose, { Schema } from "mongoose"

const ObjectId = Schema.Types.ObjectId
const name = 'Util.List'

const schema = new mongoose.Schema({
  // Headnode-specific.
  chunkLen: Number,   // Each chunk standard length.
  totalLen: Number,   // Total length in this list.
  last: ObjectId,     // Previous chunk.
  // Common.
  head: ObjectId,     // The head node of this list.
  body: Array,        // The list of chunk.
  length: Number,     // Total length in this chunk.
  prev: ObjectId,     // Previous chunk.
  next: ObjectId,     // Next chunk.
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }