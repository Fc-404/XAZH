/**
 * About File Services.
 */

import { USER_LEVEL } from "../types/userLevel.types";

export interface IUploadFile {
  // Post form
  name?: string,      // File name
  author: string,     // User
  type?: string,      // File type
  level?: USER_LEVEL, // User level
  data: Buffer,       // File Data
  md5: string,        // File Md5
}

export interface IDeleteFile {
  author: string,
  md5: string,
}

export interface IGetFile {
  level?: USER_LEVEL,
  md5: string,
}