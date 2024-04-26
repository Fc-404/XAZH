import mongoose, { Schema } from "mongoose"
import { USER_LEVEL } from "../types/userLevel.types"
import { PRIVACY_TYPE } from "../types/privacy.types"


const ObjectId = Schema.Types.ObjectId


const name: string = 'User.Base'

const schema = new mongoose.Schema({
    info: {                             // User Base Info
        privacy: {                      // About who can or not see the info. ['public', 'onlyself', 'onlyfriend']
            type: Number,
            default: PRIVACY_TYPE.public
        },
        name: String,                   // User name
        age: Number,                    // User Age
        sex: Boolean,                   // User sex
        addr: String,                   // User address
        contact: {                      // User way of contact
            qq: String,
            we: String,
            mail: String,
            phone: String,
        },
        about_me: String,               // User signature
    },

    himg: String,                     // User headimg, point to Id of file
    user: {                             // User account
        type: String,
        unique: true,
    },
    pswd: String,                       // User password, pswd + time then md5 operate

    recent_ip: [Object],                // IP list for recent signin
    belong_place: String,               // Belong place, be got by last ip of signin
    exp: {                              // Experience
        type: Number,
        default: 0
    },
    level: {                            // 'visitor', 'user', 'admin', 'master'
        type: Number,
        default: USER_LEVEL.user
    },
    ranks: [String],                    // Rank is to limit the use of specific functions
    signup_date: {                      // Signup date
        type: Date,
        default: Date.now,
    },

    disabled: Boolean,                  // Whether disable the account
    deleted: Boolean,                   // Whether delete the account

    bind_qq: String,                          // Bind QQ
    bind_we: String,                          // Bind Wechat
    bind_phone: String,                       // Bind phone number
    bind_mail: String,                        // Bind EMail

    blogs_link: ObjectId,               // Foreign key for the Blogs
    config_link: ObjectId,              // Foreign key for the Config
    message_link: ObjectId,             // Foreign key for the Message
    relation_link: ObjectId,            // Foreign key for the Relation
    property_link: ObjectId,            // Foreign key for the Property
    projects_link: ObjectId,            // Foreign key for the Project
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }