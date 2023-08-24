import mongoose from "mongoose"


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
    user: String,                       // User account
    pswd: String,                       // User password, pswd + time then md5 operate
    recent_ip: [String],                // IP list for recent signin
    belong_place: String,               // Belong place, be got by last ip of signin
    exp: Number,                        // Experience
    level: String,                      // 'visitor', 'user', 'admin', 'master'
    ranks: [String],                    // Rank is to limit the use of specific functions
    signup_time: {                      // Signup time
        type: Date,
        default: Date.now,
    },
    bind_qq: {                          // Bind QQ
        verify: Boolean,
        value: String,
    },
    bind_we: {                          // Bind Wechat
        verify: Boolean,
        value: String,
    },
    bind_phone: {                       // Bind phone number
        verify: Boolean,
        value: String,
    },
    bind_mail: {                        // Bind EMail
        verify: Boolean,
        value: String,
    },
    blogs_link: ObjectId,               // Foreign key for the Blogs
    config_link: ObjectId,              // Foreign key for the Config
    message_link: ObjectId,             // Foreign key for the Message
    relation_link: ObjectId,            // Foreign key for the Relation
    property_link: ObjectId,            // Foreign key for the Property
    projects_link: ObjectId,            // Foreign key for the Project
})

const model = mongoose.model(name, schema, name)

export default { name, schema, model }