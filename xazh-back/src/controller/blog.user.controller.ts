import {
  Controller, Inject, Post,
  UseGuard, Get
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";

@Controller('/User/Blog')
@UseGuard(TokenGuard)
export class BlogController {

  @Inject()
  ctx: Context

  @Post('/Create')
  async createBlog() {

  }

  @Get('/Info/:id')
  async getBlogInfo() {

  }

  @Get('/:id')
  async getBlogFull() {

  }

  @Post('/Gets')
  async getBlogs() {

  }

  @Post('/Edit')
  async editBlog() {

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
}
