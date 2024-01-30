import {
  Controller, Inject, Post,
  UseGuard
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";

@Controller('/Blog/Collection')
@UseGuard(TokenGuard)
export class BlogCollectionController {

  @Inject()
  ctx: Context

  // @Inject()
  @Post('/Get/:id')
  async getCollection() {

  }

  @Post('/Set/:id')
  async setCollection() {

  }

  @Post('/Append/:id')
  async appendToCollection() {

  }

  @Post('/Remove/:id')
  async removeFromCollection() {

  }
}