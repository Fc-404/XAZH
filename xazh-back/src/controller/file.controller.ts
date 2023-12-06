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

@Controller('/File')
export class FileController {

  @Inject()
  ctx: Context

  @Inject()
  fs: FileService

  @Post('/Upload')
  // @Level(USER_LEVEL.user)
  // @UseGuard([LevelGuard, TokenGuard])
  async uploadFile(@GetBoundary() boundary: string, @Headers('Custom-Filename') filename: string): Promise<any> {
    if (!filename)
      throw new MidwayValidationError('Not filename', 422, null)

    const fileSuffix = filename.slice(filename.lastIndexOf('.') + 1)
    console.log(fileSuffix);

    return 0

    // TODO: Empty of form will lead to error, that because the func parseFormData.
    return new Promise((resolve, reject) => {

      let data: Buffer = Buffer.alloc(0)
      const datas = []
      this.ctx.req.on('data', (s) => {
        datas.push(s)
      })

      this.ctx.req.on('end', async () => {
        data = Buffer.concat(datas)
        const dataArr = parseFormData(data, boundary)

        const result = []
        for (let i of dataArr) {
          const filemd5 = new Md5().appendByteArray(i.body).end()
          let r = await this.fs.upload({
            name: i.filename,
            type: i.filename,
            author: 'fjeifj123',
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
  async deleteFile() {

  }

  @Get('/:md5')
  async getFile(@Param('md5') md5: string, @Query('save') save: boolean) {
    const filei = await this.fs.getInfo(md5)

    if (filei.fileSize > 16000000) {
      console.log(filei.fileSize);
      throw new httpError.ForbiddenError()
    }

    // Set file type.
    const filetype = filei.fileType?.split('/')[1]
    if (filetype)
      this.ctx.set('Content-Type', filetype)
    // Whether download the file for save.
    if (save)
      this.ctx.set('Content-Disposition',
        'attachment')

    const result = await this.fs.getAll({
      level: 3,
      md5
    })

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
      level: 3,
      md5
    })

    // Set file type.
    const filetype = result.filei.fileType?.split('/')[1]
    if (filetype)
      this.ctx.set('Content-Type', filetype)

    // Whether download the file for save.
    console.log('attachment; filename="' + result.filei.fileName + '"');
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