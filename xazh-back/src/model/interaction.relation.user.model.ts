import mongoose, { Types } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId
const name: string = 'User.Relation.Interaction'

const schema = new mongoose.Schema({
  _id: String,            // Max user's id + Min user's id
  followtime: Date,       // Max user follow to Min user time
  followertime: Date,     // Min user follow to Max user time
  isfollow: Boolean,      // Max user follow Min user
  isfollower: Boolean,    // Min user follow Max user
  blacklist: [ObjectId]   // If exist user's id in blacklist, the user be blacked.
})

const model = mongoose.model(name, schema, name)

const generateId = function (id1: Types.ObjectId, id2: Types.ObjectId) {
  return id1.getTimestamp() > id2.getTimestamp() ? {
    id: id1.toString() + id2.toString(),
    reverse: false
  } : {
    id: id2.toString() + id1.toString(),
    reverse: true
  }
}

export default { name, schema, model, generateId }
