import { Controller, Inject, Post } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { UploadFileService } from "../service/upload.file.service";

import { GetBoundary } from "../decorator/param/formdata.decorator";
import parseFormData from "../util/parseFormData.util";

@Controller('/Upload')
export class FileUploadController {

  @Inject()
  ctx: Context

  @Inject()
  uf: UploadFileService

  @Post('/')
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
            data: i.body
          })

          result.push(r)
        }


        resolve(result)
      })

    })

  }
}