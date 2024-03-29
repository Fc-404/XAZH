import {
  Controller, Inject, Post,
  UseGuard, Get
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";

@Controller('/User/Collection')
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

}