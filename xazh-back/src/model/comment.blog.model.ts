import mongoose from "mongoose";

const name: string = 'Blog.Comment'

/**
replyTemp {
  user: ObjectId,       // reply's auther
  content: String,      // reply content
  likecount: Number,    // like counter
  atwho: [ObjectId],    // the list of user who be at
  date: {               // date
    type: Date,
    default: Date.now
  }
}
*/

const schema = new mongoose.Schema({
  count: Number,
  body: Object,
  /**
  key userid+time
  value {
    ...replyTemp,
    reply: [{
      ...replyTemp,
      replywho: String  // The string is reply's ID
    }]
  }
  */
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }