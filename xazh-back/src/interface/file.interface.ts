/**
 * About File Services.
 */

import { ObjectId } from "mongoose";
import { USER_LEVEL } from "../types/userLevel.types";

export interface IUploadFile {
  // Post form
  name?: string,      // File name
  author: ObjectId,     // User ID
  type?: string,      // File type
  level?: USER_LEVEL, // User level
  data: Buffer,       // File Data
  md5: string,        // File Md5
}

export interface IDeleteFile {
  author: ObjectId,
  level?: USER_LEVEL,
  md5: string,
}

export interface IGetFile {
  level?: USER_LEVEL,
  md5: string,
}