/**
 * About File Services.
 */

import { Types } from "mongoose";
import { USER_LEVEL } from "../types/userLevel.types";

export interface IUploadFile {
  // Post form
  name?: string,      // File name
  author: Types.ObjectId,     // User ID
  type?: string,      // File type
  level?: USER_LEVEL, // User level
  data: Buffer,       // File Data
  fid: string,        // File Uid
}

export interface IDeleteFile {
  author: Types.ObjectId,
  level?: USER_LEVEL,
  fid: string,
}

export interface IGetFile {
  level?: USER_LEVEL,
  fid: string,
}
