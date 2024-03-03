import { Provide } from "@midwayjs/core";
import { IDeleteFile, IGetFile, IUploadFile } from "../interface/file.interface";

import FileData from '../model/data.file.model'
import FileInfo from '../model/info.file.model'

import fileConfig from "../config/file.config";
import { DefaultErrorFilter } from "../filter/default.filter";
import { Types } from "mongoose";

@Provide()
export class FileService {

  /**
   * Upload File.
   * Here had handled the respond.
   * TODO: Due to handle the req necessarily, so cann't return status.
   * @param options 
   * @returns Number
   * code:
   * 1: The file size is too large.
   * 0: Success.
   * -1: The file is alread exist.
   * 2: Save file had been Exception.
   */
  async upload(options: IUploadFile) {
    const filel = options.data.length
    if (filel > fileConfig.maxSize['default']) {
      return 1
    }

    let result: any = await FileInfo.model.findOne({ fileUid: options.uid })
    if (result) {
      let authorL = result.author.length
      // ! The number 100 is the threshold to set the field of persitend.
      if (authorL > 100) {
        result.persitent = true
      } else {
        result.author.indexOf(options.author) == -1
          ? result.author.push(options.author)
          : null
      }
      await result.save()
      return -1
    }

    const session = await FileInfo.model.startSession()
    session.startTransaction()
    let filedata = []
    try {
      const cellL = fileConfig.mongodbCellSize
      for (let i = 0; i < filel; i += cellL) {
        let end = i + cellL
        end = end > filel ? filel : end
        let d: Buffer = options.data.slice(i, end)

        let filed = await FileData.model.create([{
          data: d
        }], { session })
        filedata.push(filed[0]['_id'])
      }

      await FileInfo.model.create([{
        fileUid: options.uid,
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

    return 0
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
    const file = await FileInfo.model.findOne({ fileUid: options.uid })

    // Not file
    if (!file)
      return -1

    // If user's level higher than or equal 2, remove it directly.
    if (options?.level < 2) {
      // Can't delete
      if (file.persitent)
        return 1

      // TODO: no atomicity
      // Delete user
      const userIndex = file.author.indexOf(options.author)
      if (userIndex > -1) {
        file.author.splice(userIndex, 1)
      }

      // Have somebody is author of the file
      if (file.author.length > 0) {
        await file.save()
        return 0
      }
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
   * Get infomation about the file.
   * @param uid 
   * @returns FileInfo
   */
  async getInfo(uid: string, filter: Array<string> = []) {
    return await FileInfo.model.findOne({ fileUid: uid }, filter) ?? null
  }

  /**
   * Get full file.
   * ! This function is not recommended.
   * ! Unless it is explicitly known that 
   * ! the file is less than 1.6M.
   * @param options 
   * @returns Object | number
   */
  async getAll(options: IGetFile) {
    const filei = await this.getInfo(options.uid)
    if (!filei)
      return -1
    if (filei?.level > (options.level ?? 0))
      return 1

    const filed = []
    for (let i of filei.data) {
      filed.push((await FileData.model.findById(i)).data)
    }

    return {
      info: filei,
      data: Buffer.concat(filed)
    }
  }

  /**
   * Get deals, anyone of which will get cell of file.
   * @param options 
   * @returns Object | number
   * -1: There is no such file.
   * 1: There is no permission to access the file.
   */
  async get(options: IGetFile) {
    const filei = await this.getInfo(options.uid)
    if (!filei)
      return -1
    if (filei?.level > (options.level ?? 0))
      return 1

    const fileDeals: Array<Function> = []
    for (let i of filei.data) {
      fileDeals.push(async () => {
        try {
          return (await FileData.model.findById(i)).data
        } catch (e) {
          throw DefaultErrorFilter
        }
      })
    }

    return {
      filei: filei,
      filed: fileDeals
    }
  }

  /**
   * ! This way is to get file by the Readable Function.

  async getI(options: IGetFile) {
    const filei = await this.getInfo(options.uid)
    if (filei?.level > options.level)
      return null

    const s = new Readable()
    for (let i of filei.data) {
      s.push((await FileData.model.findById(i)).data)
    }
    s.push(null)

    return s
  }
  */
}