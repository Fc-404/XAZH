/**
 * Upload File
 */

export interface IUploadFileOptions {
  // Post form
  name?: String,      // File name
  author?: String,    // User's _id
  type?: String,      // File type
  data: Buffer,       // File Data
}