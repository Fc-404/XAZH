import mongoose from "mongoose";

const name: string = 'User.Message'


/**
msg = {
  i: Number,
  who: ObjectId,
  content: String,
  time: {
    type: Date,
    default: Date.now
  }
}
newmsg = {
  key: userid,
  value: [msg]
}
msglist = {
  key: userid,
  value: {
    msgid: ObjectId,
    show: Boolean,
    pinned: Boolean,
  }
}
*/

const schema = new mongoose.Schema({
  newmsg: Object,
  msglist: Object,
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }