import mongoose, {Schema} from "mongoose";

const ObjectId = Schema.Types.ObjectId
const name: string = 'User.Blog.Read'
const listMax = 1000

const schema = new mongoose.Schema({
  list: [ObjectId]
})

const model = mongoose.model(name, schema, name)

export default {name, schema, model, listMax}
