import { Body, Controller, Inject, Post, UseGuard } from "@midwayjs/core";
import { Context } from "koa";
import { ObjectId } from "mongodb";
import { TokenGuard } from "../guard/token.guard";

import { BlogUserService } from "../service/blog.user.service";
import { StarBlogUserService } from "../service/star.blog.user.service";
import { StarFolderBlogDTO } from "../dto/blog.dto";

@Controller('/Star')
export class StarBlogController {
  @Inject()
  ctx: Context
  @Inject()
  blog: BlogUserService
  @Inject()
  star: StarBlogUserService


  /**
   * Star a blog.
   * @param bid
   * @param folder
   * @returns
   */
  @Post('/Add')
  @UseGuard(TokenGuard)
  async starBlog(@Body('bid') bid: string, @Body('folders') folders?: string[]) {
    if (!ObjectId.isValid(bid)) {
      this.ctx.status = 403
      return '无效的博客id'
    }
    folders = typeof folders === 'string' ? [folders] : folders

    const bId = new ObjectId(bid)
    const result = await this.star.star(this.ctx.user.id, bId, folders)
    if (!result) {
      this.ctx.status = 400
    }
    return result
  }

  /**
   * Unstar a blog.
   * @param bid
   * @param folder
   * @param chunk
   * @returns
   */
  @Post('/Unstar')
  @UseGuard(TokenGuard)
  async unstarBlog(@Body('bid') bid: string,
    @Body('folders') folders?: string[],
    @Body('chunk') chunk?: string) {
    if (!ObjectId.isValid(bid)) {
      this.ctx.status = 403
      return '无效的博客id'
    }
    folders = typeof folders === 'string' ? [folders] : folders

    const bId = new ObjectId(bid)
    const chunkId = chunk ? new ObjectId(chunk) : undefined
    return await this.star.unstar(this.ctx.user.id, bId, folders, chunkId)
  }

  /**
   * Get items from a folder.
   * @param name 
   * @param chunk 
   * @returns 
   */
  @Post('/Folder')
  async getFolderItems(@Body('name') name: string, @Body('uid') uid?: string,
    @Body('chunk') chunk?: string) {
    if (uid && !ObjectId.isValid(uid) ||
      chunk && !ObjectId.isValid(chunk)) {
      this.ctx.status = 422
      return '无效的chunk'
    }

    const uId = uid ? new ObjectId(uid) : this.ctx.user.id
    const result = await this.star.getItemsByFolder(
      uId, name, chunk ? new ObjectId(chunk) : undefined
    )
    if (!result) {
      this.ctx.status = 400
    }
    return result
  }

  /**
   * Get folders.
   */
  @Post('/GetFolders')
  @UseGuard(TokenGuard)
  async getFolders() {
    return await this.star.getFolders(this.ctx.user.id)
  }

  /**
   * Create a folder
   * @param options 
   * @returns 
   */
  @Post('/Create')
  @UseGuard(TokenGuard)
  async createFolder(@Body() options: StarFolderBlogDTO) {
    const result = await this.star.createFolder(
      this.ctx.user.id, [{
        name: options.name,
        description: options.description,
        cover: options.cover,
        privacy: options.privacy
      }]
    )

    if (!result) {
      this.ctx.status = 400
    }
    return result ? true : false
  }

  /**
   * Modify a folder information.
   * @param options 
   * @returns 
   */
  @Post('/Modify')
  @UseGuard(TokenGuard)
  async modifyFolder(@Body() options: StarFolderBlogDTO) {
    const result = await this.star.modifyFolder(
      this.ctx.user.id, {
      name: options.name,
      newName: options.newname,
      description: options.description,
      cover: options.cover,
      privacy: options.privacy
    })

    if (!result) {
      this.ctx.status = 400
    }
    return result
  }

  /**
   * Delete a folder.
   * @param names 
   * @returns 
   */
  @Post('/DeleteFolder')
  @UseGuard(TokenGuard)
  async deleteFolder(@Body('names') names: string[]) {
    names = typeof names === 'string' ? [names] : names

    const result = await this.star.deleteFolder(this.ctx.user.id, names)
    if (!result) {
      this.ctx.status = 400
    }
    return result
  }
}