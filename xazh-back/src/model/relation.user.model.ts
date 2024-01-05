import mongoose from "mongoose";

const name: string = 'User.Relation'

/*
itemTemp = {
  key: userid,
  value: {
    followtime: Date,
    followertime: Date,
    isfollow: Boolean,
    isfollower: Boolean,
    group: String,
  }
}
*/

const schema = new mongoose.Schema({
  list: Object,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }