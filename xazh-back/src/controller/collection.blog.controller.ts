import {
  Controller, Inject, Post,
} from "@midwayjs/core";
import { Context } from "koa";

@Controller('/Blog/Collection')
export class BlogCollectionController {

  @Inject()
  ctx: Context

  @Post('/Create')
  async createColl() { }

  @Post('/Delete')
  async deleteColl() { }

  @Post('/Get')
  async getColls() { }

  @Post('/GetBlogs')
  async getBlogs() { }

  @Post('/DeleteOne')
  async deleteOneFromColl() { }

  @Post('/AppendOne')
  async appendOneToColl() { }

  @Post('/Modify')
  async modifyColl() { }

  @Post('/Subscribe')
  async subscribeColl() { }

  @Post('/Unsubscribe')
  async unsubscribeColl() { }

}
