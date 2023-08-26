import { Provide } from "@midwayjs/core";
import { IUploadFile } from "../interface/file.interface";

import FileData from '../model/data.file.model'
import FileInfo from '../model/info.file.model'

import { Md5 } from "ts-md5";

@Provide()
export class UploadFileService {

  /**
   * Upload File.
   * Here had handled the respond.
   * TODO: Due to handle the req necessarily, so cann't return status.
   * @param options 
   */
  async upload(options: IUploadFile) {
    // TODO: Not auther. And Not size judge. And Not routine.
    const filemd5 = new Md5().appendByteArray(options.data).end()

    let result: any = await FileData.model.findOne({ _id: filemd5 })
    if (!result) {
      result = await FileData.model.create({
        _id: filemd5,
        data: options.data
      })
      await FileInfo.model.create({
        fileName: options.name ?? filemd5,
        fileSize: options.data.length,
        data: [filemd5]
      })
    } else {
      result = { have: true }
    }

    return result
  }
}