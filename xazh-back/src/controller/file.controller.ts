import {
  Body, Controller, Get, Inject,
  Param, Post, Query, UseGuard, httpError,
  Headers
} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { FileService } from "../service/file.service";

import { GetBoundary } from "../decorator/param/formdata.decorator";
import parseFormData from "../util/parseFormData.util";
import { Md5 } from "ts-md5";
import { Level } from "../decorator/auth/level.decorator";
import { USER_LEVEL } from "../types/userLevel.types";
import { LevelGuard } from "../guard/level.guard";
import { TokenGuard } from "../guard/token.guard";
import { MidwayValidationError } from "@midwayjs/validate";
import { FILE_TYPE } from "../types/file.types";

@Controller('/File')
export class FileController {

  @Inject()
  ctx: Context

  @Inject()
  fs: FileService

  @Post('/Upload')
  @Level(USER_LEVEL.user)
  @UseGuard([LevelGuard, TokenGuard])
  async uploadFile(
    @GetBoundary() boundary: string,
    @Headers('Content-Length') filesize: number,
    @Headers('Custom-Filename') filename: string,
  ): Promise<any> {
    //- Require filename.
    if (!filename)
      throw new MidwayValidationError('Not filename.', 422, null)

    //- Judge file type.
    const fileSuffix = filename.slice(filename.lastIndexOf('.') + 1)
    if (FILE_TYPE[fileSuffix] === undefined) {
      throw new httpError.ForbiddenError('Not suported file type.')
    }

    //- Whether have body.
    if (!boundary || !filesize) {
      throw new httpError.BadRequestError('Not Body.')
    }

    // //- Limit file size. 16M
    if (filesize > 16000000) {
      throw new httpError.ForbiddenError('File too large.')
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
          const filemd5 = new Md5().appendByteArray(i.body).end()
          let r = await this.fs.upload({
            name: filename,
            type: FILE_TYPE[fileSuffix],
            author: this.ctx.user['name'],
            md5: filemd5 as string,
            data: i.body
          })
          result.push(r)
        }

        resolve(result)
      })
    })
  }

  @Post('/Delete')
  @Level(USER_LEVEL.user)
  @UseGuard([LevelGuard, TokenGuard])
  async deleteFile(@Body('md5') md5: string) {
    console.log(this.ctx.user['level']);

    const result = await this.fs.delete({
      author: this.ctx.user['name'],
      level: this.ctx.user['level'],
      md5: md5
    })

    return result
  }

  @Get('/:md5')
  async getFile(@Param('md5') md5: string, @Query('save') save: boolean) {
    const filei = await this.fs.getInfo(md5)

    if (!filei)
      throw new httpError.NotFoundError('There is no such file.')
    // 1.6M file size limit.
    if (filei.fileSize > 1600000) {
      throw new httpError.ForbiddenError('File size limit, switch to post.')
    }

    // Set file type.
    const filetype = filei.fileType
    if (filetype)
      this.ctx.set('Content-Type', filetype)
    // Whether download the file for save.
    if (save)
      this.ctx.set('Content-Disposition',
        'attachment')

    const result = await this.fs.getAll({
      level: this.ctx.user['level'],
      md5
    })

    if (result == -1) {
      throw new httpError.NotFoundError('There is no such file.')
    }
    if (result == 1) {
      throw new httpError.ForbiddenError('There is no permission to access the file.')
    }

    this.ctx.set('Content-Length', result.info.fileSize.toString())

    this.ctx.form = false
    return result?.data
  }

  @Post('/Get')
  @Level(USER_LEVEL.user)
  @UseGuard([LevelGuard, TokenGuard])
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