import {
  Controller, Inject, Post,
  UseGuard
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";

@Controller('/Blog')
@UseGuard(TokenGuard)
export class BlogController {

  @Inject()
  ctx: Context

  @Post('/CreateBlog')
  async createBlog() {

  }

  @Post('/CreateCollection')
  async createCollection() {

  }

  @Post('/GetBlogs')
  async getBlogs() {

  }

  @Post('/GetCollections')
  async getCollections() {

  }
}