import mongoose from "mongoose"


const name: string = 'File.Data'

const schema = new mongoose.Schema({
  data: Buffer    // Binary Data
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model}
