import { Provide } from "@midwayjs/core";
import { IDeleteFile, IGetFile, IUploadFile } from "../interface/file.interface";

import FileData from '../model/data.file.model'
import FileInfo from '../model/info.file.model'

import fileConfig from "../config/file.config";
import { Md5 } from "ts-md5";

@Provide()
export class UploadFileService {

  /**
   * Upload File.
   * Here had handled the respond.
   * TODO: Due to handle the req necessarily, so cann't return status.
   * @param options 
   * @returns Number | Object
   * 1: The file size is too large.
   * -1: The file is alread exist.
   * 2: Save file had been Exception.
   */
  async upload(options: IUploadFile) {
    const filel = options.data.length
    if (filel > fileConfig.maxSize[options.type as string || 'default']) {
      return 1
    }

    // TODO: Not auther. And Not size judge. And Not routine.
    const filemd5 = new Md5().appendByteArray(options.data).end()

    let result: any = await FileInfo.model.findOne({ fileMd5: filemd5 })
    if (result) {
      let autherL = result.data.auther.length
      // ! The number 100 is threshold to set the field of persitend.
      if (autherL > 100) {
        result.persitent = true
      } else {
        result.auther.indexOf(options.author) == -1
          ? result.auther.push(options.author)
          : null
      }
      await result.save()
      return -1
    }

    const session = await FileInfo.model.startSession()
    session.startTransaction()
    let filedata = []
    let fileinfo
    try {
      for (let i = 0; i < filel; i += 16000000) {
        let end = i + 16000000
        end = end > filel ? filel : end
        let d: Buffer = options.data.slice(i, end)

        let filed = await FileData.model.create([{
          data: d
        }], { session })
        filedata.push(filed['_id'])
      }

      fileinfo = await FileInfo.model.create([{
        fileMd5: filemd5,
        fileName: options.name,
        fileSize: filel,
        fileType: options.type,
        level: options.level ?? 0,
        data: filedata,
        author: [options.author],
      }], { session })

      await session.commitTransaction()
    } catch {
      await session.abortTransaction()
    } finally {
      session.endSession()
    }

    return fileinfo
  }

  /**
   * Delete File
   * @param options 
   * @returns Number
   * -1: The file is not exist.
   * 1: The file will never delete.
   * 0: All is OK.
   * 2: Delete the file.
   */
  async delete(options: IDeleteFile) {
    const file = await FileInfo.model.findOne({ fileMd5: options.md5 })

    // Not file
    if (!file)
      return -1

    // Can't delete
    if (file.persitent)
      return 1

    // Delete user
    const userIndex = file.author.indexOf(options.author as string)
    if (userIndex > -1) {
      file.author.splice(userIndex, 1)
    }

    // Have somebody is author of the file
    if (file.author.length > 0) {
      await file.save()
      return 0
    }

    // Nobody have this file, and delete it.
    const session = await FileInfo.model.startSession()
    session.startTransaction()

    try {
      const dataIds = file.data
      for (const dataId of dataIds) {
        await FileData.model.findByIdAndDelete(dataId, { session })
      }
      await file.deleteOne({ session })

      await session.commitTransaction()
    } catch {
      await session.abortTransaction()
    } finally {
      session.endSession()
    }
    return 2
  }

  /**
   * Get File
   * @param options 
   * @returns -1 | Object
   * -1: means that no authority.
   */
  async get(options: IGetFile) {
    const filei = await FileInfo.model.findOne({ fileMd5: options.md5 })
    if (filei.level > options.level)
      return -1

    const filed = await FileData.model.findById({ _id: filei.data[0] })

    return {
      info: filei,
      data: filed
    }
  }
}