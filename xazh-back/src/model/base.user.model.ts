import { Mongod, Schema } from "../util/mongod"

var name: string = 'UserBase'

var schema = new Schema({
    name: String,
    age: Number,
    sex: Boolean,
    pswd: String,
    bind_qq: String,
    bind_we: String,
    bind_phone: String,
    bind_mail: String,
    exp: Number,
    level: String,
    ranks: Array<String>,
    signup: {
        type: Date,
        default: Date.now
    }
})

var model = Mongod.getMongoose().model(name, schema, name)

export default {name, schema, model}