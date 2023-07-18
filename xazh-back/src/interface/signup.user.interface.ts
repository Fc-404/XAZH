import { ObjectId } from "mongoose";

export interface ISignUpUserOptions {
    user: String,
    pswd: String,
    himg: ObjectId,
}
