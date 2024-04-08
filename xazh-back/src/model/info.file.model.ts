import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId
const name: string = 'File.Info'

const schema = new mongoose.Schema({
  fid: {
    type: String,
    unique: true,
  },
  fileName: String,         // File name, just save name that the first give.
  fileSize: Number,         // File size, that unit is the Byte
  fileType: String,         // File type, such as 'jpg', 'mp3'
  uploadTime: {             // The time of upload
    type: Date,
    default: Date.now,
  },
  level: Number,            // User level
  // The list of the Data.File Document.
  data: [ObjectId],
  // who uploaded. Type is userid.
  author: [ObjectId],
  // whether delete. If true, never delete.
  persitent: {
    type: Boolean,
    default: false,
  },
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }
