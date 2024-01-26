import {
  Body, Controller, Get, Inject,
  Param, Post, Query, UseGuard, httpError,
  Headers
} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { FileService } from "../service/file.service";

import { GetBoundary } from "../decorator/param/formdata.decorator";
import parseFormData from "../util/parseFormData.util";
import { TokenGuard } from "../guard/token.guard";
import { MidwayValidationError } from "@midwayjs/validate";
import { FILE_TYPE } from "../types/file.types";

@Controller('/File')
export class FileController {

  @Inject()
  ctx: Context

  @Inject()
  fs: FileService

  /**
   * Upload file.
   * You have to provide the file name and size in the header.
   * @param boundary 
   * @param filesize 
   * @param filename 
   * @returns 
   */
  @Post('/Upload')
  @UseGuard(TokenGuard)
  async uploadFile(
    @GetBoundary() boundary: string,
    @Headers('Content-Length') filesize: number,
    @Headers('Custom-Filename') filename: string,
    @Headers('Custom-MD5') filemd5: string,
  ): Promise<any> {
    //- Require param.
    if (!filename || !filemd5)
      throw new MidwayValidationError('No filename.', 422, null)

    //- Judge file type.
    const fileSuffix = filename.slice(filename.lastIndexOf('.') + 1)
    if (FILE_TYPE[fileSuffix] === undefined) {
      throw new httpError.ForbiddenError('Not suported file type.')
    }

    //- Whether have body.
    if (!boundary || !filesize) {
      throw new httpError.BadRequestError('Not Body.')
    }

    //- Limit file size. 16M
    if (filesize > 16000000) {
      throw new httpError.ForbiddenError('File too large.')
    }

    //- Whether exist file.
    if (await this.fs.getInfo(filemd5)) {
      return filemd5
    }

    //- Receive file.
    return new Promise((resolve, reject) => {

      let data: Buffer = Buffer.alloc(0)
      let datas = []
      this.ctx.req.on('data', (s) => {
        datas.push(s)
      })

      this.ctx.req.on('end', async () => {
        data = Buffer.concat(datas)
        datas = []
        const dataArr = parseFormData(data, boundary, true)
        const result = []
        for (let i of dataArr) {
          // const filemd5 = new Md5().appendByteArray(i.body).end()
          let r = await this.fs.upload({
            name: i.filename,
            type: FILE_TYPE[fileSuffix],
            author: this.ctx.user['id'],
            md5: filemd5,
            data: i.body
          })
          if (r == 0)
            result.push(filemd5)
          else {
            this.ctx.code = 1
            this.ctx.message = '上传失败'
            reject(filename)
          }
        }

        resolve(result.pop())
      })
    })
  }

  /**
   * Delete the file.
   * @param md5 
   * @returns 
   */
  @Post('/Delete')
  @UseGuard(TokenGuard)
  async deleteFile(@Body('md5') md5: string) {
    const result = await this.fs.delete({
      author: this.ctx.user['id'],
      level: this.ctx.user['level'],
      md5: md5
    })

    return result
  }

  /**
   * Get information of file.
   */
  @Get('/GetInfo/:md5')
  async getInfoByMD5(@Param('md5') md5: string) {
    const filter = ['fileMd5', 'fileName', 'fileSize', 'fileType']
    const result = await this.fs.getInfo(md5, filter)
    if (!result) {
      this.ctx.code = 1
      return 'No information.'
    }
    return result
  }

  /**
   * Get the file.
   * @param md5 
   * @param save 
   * @returns 
   */
  @Get('/:md5')
  async getFile(@Param('md5') md5: string, @Query('save') save: boolean) {
    this.ctx.set('Transfer-Encoding', 'chunked')
    this.ctx.set('Access-Control-Allow-Origin', '*')

    const result = await this.fs.get({
      level: this.ctx.user['level'],
      md5
    })

    if (result == -1) {
      throw new httpError.NotFoundError('There is no such file.')
    }
    if (result == 1) {
      throw new httpError.ForbiddenError('There is no permission to access the file.')
    }

    // Set file type.
    const filetype = result.filei.fileType
    if (filetype)
      this.ctx.set('Content-Type', filetype)

    // Whether download the file for save.
    if (save)
      this.ctx.set('Content-Disposition',
        'attachment')

    for (let i of result.filed) {
      this.ctx.res.write(await i())
    }

    this.ctx.res.end
    this.ctx.form = false
    return null
  }

  /**
   * TODO
   * Get list of file.
   * @param md5 
   * @param save 
   * @returns 
   */
  @Post('/Get')
  @UseGuard(TokenGuard)
  async getFiles(@Body('md5') md5: string, @Body('save') save: boolean) {
    this.ctx.set('Transfer-Encoding', 'chunked')
    this.ctx.set('Access-Control-Allow-Origin', '*')

    const result = await this.fs.get({
      level: this.ctx.user['level'],
      md5
    })

    if (result == -1) {
      throw new httpError.NotFoundError('There is no such file.')
    }
    if (result == 1) {
      throw new httpError.ForbiddenError('There is no permission to access the file.')
    }

    // Set file type.
    const filetype = result.filei.fileType
    if (filetype)
      this.ctx.set('Content-Type', filetype)

    // Whether download the file for save.
    if (save)
      this.ctx.set('Content-Disposition',
        'attachment')

    for (let i of result.filed) {
      this.ctx.res.write(await i())
    }

    this.ctx.res.end
    this.ctx.form = false
    return null
  }
}