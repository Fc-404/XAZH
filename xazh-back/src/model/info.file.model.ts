import mongoose from "mongoose";

const name: string = 'File.Info'

const schema = new mongoose.Schema({
  fileMd5: {
    type: String,
    unique: true,
  },
  fileName: String,         // File name
  fileSize: Number,         // File size, that unit is the Byte
  fileType: String,         // File type, such as 'jpg', 'mp3'
  firstAuthor: mongoose.Types.ObjectId,
  // The author of the first upload
  uploadTime: {             // The time of upload
    type: Date,
    default: Date.now,
  },
  data: [String]            // The list of the Data.File Document. It is MD5 string.
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }