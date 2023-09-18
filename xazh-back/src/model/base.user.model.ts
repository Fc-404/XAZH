import mongoose from "mongoose"
import { USER_LEVEL } from "../types/userLevel.types"


const ObjectId = mongoose.Types.ObjectId


const name: string = 'User.Base'

const schema = new mongoose.Schema({
    info: {                             // User Base Info
        privacy: {                      // About who can or not see the info
            type: String,               // 'public', 'privacy', 'whocan', 'whocannot'
            whocan: [ObjectId],
            whocannot: [ObjectId],      // The type in List is UserId 
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

    himg: ObjectId,                     // User headimg, point to Id of file
    user: {                             // User account
        type: String,
        unique: true,
    },
    pswd: String,                       // User password, pswd + time then md5 operate

    recent_ip: [                        // IP list for recent signin
        { ip: String, place: String }
    ],
    belong_place: String,               // Belong place, be got by last ip of signin
    exp: Number,                        // Experience
    level: {                            // 'visitor', 'user', 'admin', 'master'
        type: Number,
        default: USER_LEVEL.visitor
    },
    ranks: [String],                    // Rank is to limit the use of specific functions
    signup_time: {                      // Signup time
        type: Date,
        default: Date.now,
    },

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