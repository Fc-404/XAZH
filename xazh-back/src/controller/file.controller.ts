import { Controller, Get, Inject, Post } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { UploadFileService } from "../service/upload.file.service";

import { GetBoundary } from "../decorator/param/formdata.decorator";
import parseFormData from "../util/parseFormData.util";

@Controller('/File')
export class FileUploadController {

  @Inject()
  ctx: Context

  @Inject()
  uf: UploadFileService

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
          let r = await this.uf.upload({
            name: i.filename,
            author: 'fjeifj',
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
  async getFile() {

  }

  @Post('/Get')
  async getFiles() {

  }
}