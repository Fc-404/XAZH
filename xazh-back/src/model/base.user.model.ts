import { Mongod, Schema } from "../util/mongod"

const ObjectId = Schema.Types.ObjectId

var name: string = 'UserBase'

var schema = new Schema({
    info: {
        privacy: {
            type: String,
            whocan: [ObjectId],
            whocannot: [ObjectId],
        },
        name: String,
        age: Number,
        sex: Boolean,
        addr: String,
        contact: {
            qq: String,
            we: String,
            mail: String,
            phone: String,
        },
        about_me: String,
    },
    himg: ObjectId,
    user: String,
    pswd: String,
    recent_ip: [String],
    belong_place: String,
    exp: Number,
    level: String,
    ranks: [String],
    signup_time: {
        type: Date,
        default: Date.now,
    },
    bind_qq: {
        verify: Boolean,
        value: String,
    },
    bind_we: {
        verify: Boolean,
        value: String,
    },
    bind_phone: {
        verify: Boolean,
        value: String,
    },
    bind_mail: {
        verify: Boolean,
        value: String,
    },
    blogs_link: ObjectId,
    config_link: ObjectId,
    message_link: ObjectId,
    relation_link: ObjectId,
    property_link: ObjectId,
    projects_link: ObjectId,
})

var model = Mongod.getMongoose().model(name, schema, name)

export default { name, schema, model }