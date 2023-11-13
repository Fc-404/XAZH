/**
 * About File Services.
 */

import { USER_LEVEL } from "../types/userLevel.types";

export interface IUploadFile {
  // Post form
  name?: String,      // File name
  author: String,     // User
  type?: String,      // File type
  level?: USER_LEVEL,  // User level
  data: Buffer,       // File Data
}

export interface IDeleteFile {
  author: String,
  md5: String,
}

export interface IGetFile {
  level?: USER_LEVEL,
  md5: String,
}