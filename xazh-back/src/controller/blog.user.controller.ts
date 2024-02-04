import {
  Controller, Inject, Post,
  UseGuard
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";

@Controller('/User/Blog')
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

  @Post('/AppendRead')
  async appendRead() {

  }

  @Post('/AppendLike')
  async appendLike() {

  }

  @Post('/AppendStar')
  async appendStar() {

  }

  // @Post('')
}