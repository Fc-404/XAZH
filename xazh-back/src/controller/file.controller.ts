import { Body, Controller, Get, Inject, Param, Post } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { FileService } from "../service/file.service";

import { GetBoundary } from "../decorator/param/formdata.decorator";
import parseFormData from "../util/parseFormData.util";
import { Md5 } from "ts-md5";

@Controller('/File')
export class FileController {

  @Inject()
  ctx: Context

  @Inject()
  fs: FileService

  @Post('/Upload')
  async uploadFile(@GetBoundary() boundary: string): Promise<any> {
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
  async getFile(@Param('md5') md5) {
    this.ctx.set('Content-type', 'video/mp4')

    const result = await this.fs.getAll({
      level: 3,
      md5
    })

    // console.log(result);
    this.ctx.form = false
    return result
  }

  @Post('/Get')
  async getFiles(@Body('md5') md5) {
    this.ctx.set('Transfer-Encoding', 'chunked')
    this.ctx.set('Access-Control-Allow-Origin', '*')
    this.ctx.set('Content-Type', 'text/plain')

    for (let i = 0; i < 10000; ++i)
      this.ctx.res.write(Buffer.from(i.toString()))

    this.ctx.res.end()


    // const result = await this.fs.getAll({
    //   level: 3,
    //   md5
    // })

    // console.log(result);

    this.ctx.form = false
    return null
  }
}