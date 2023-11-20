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

    console.log('请求', process.memoryUsage());
    const result = await this.fs.getAll({
      level: 3,
      md5
    })
    console.log('请求结束', process.memoryUsage());

    // console.log(result);
    this.ctx.form = false
    return result?.data
  }

  @Post('/Get')
  async getFiles(@Body('md5') md5) {
    this.ctx.set('Transfer-Encoding', 'chunked')
    this.ctx.set('Access-Control-Allow-Origin', '*')
    this.ctx.set('Content-Type', 'video/mp4')

    console.log('请求', process.memoryUsage());

    const result = await this.fs.get({
      level: 3,
      md5
    })

    console.log('获取数据', process.memoryUsage());

    let ii = 0
    for (let i of result.filed) {
      this.ctx.res.write(await i())
      console.log(`数据${ii++}已发送`, process.memoryUsage());
    }

    this.ctx.res.end
    console.log('请求结束', process.memoryUsage());
    this.ctx.form = false
    return null
  }
}