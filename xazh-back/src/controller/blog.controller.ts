import {
  Controller, Inject, Post,
  UseGuard, Body,
  httpError,
} from "@midwayjs/core";
import { TokenGuard } from "../guard/token.guard";
import { Context } from "koa";
import { ObjectId } from "mongodb";

import { BlogUserService } from "../service/blog.user.service";
import { CommentBlogService } from "../service/comment.blog.service";
import { StarBlogUserService } from "../service/star.blog.user.service";
import { PRIVACY_TYPE } from "../types/privacy.types";
import { BlogCommentDTO, BlogInfoDTO } from "../dto/blog.dto";


@Controller('/Blog')
export class BlogController {

  @Inject()
  ctx: Context
  @Inject()
  blog: BlogUserService
  @Inject()
  star: StarBlogUserService
  @Inject()
  comment: CommentBlogService

  /**
   * Publish a blog
   * @param options 
   * @returns body is true if success. 
   */
  @Post('/Publish')
  @UseGuard(TokenGuard)
  async createBlog(@Body() options: BlogInfoDTO) {
    const uid = this.ctx.user.id
    const result = await this.blog.createBlog(uid, {
      title: options.title,
      author: uid,
      abstract: options.abstract,
      keywords: options.keywords,
      privacy: options.privacy ?? PRIVACY_TYPE.public,
      body: options.body,
      type: options.type ?? -1,
      wordcloud: options.wordcloud ?? {}
    })
    return result
  }

  /**
   * Get a blog info and body by blog id
   * @param bid 
   * @returns Get info and body if success, or will have 403 error.
   */
  @Post('/Get')
  async getBlog(@Body() bid: string) {
    const blogId = new ObjectId(bid)
    const blogInfo = await this.blog.getBlogInfo(blogId)

    switch (blogInfo.privacy) {
      case PRIVACY_TYPE.onlyself:
        if (!blogInfo.author.equals(this.ctx.user.id))
          new httpError.ForbiddenError('You cannot access this blog.')
        break
      case PRIVACY_TYPE.onlyfriend:
        // TODO: check if the user is friend of the author
        new httpError.ForbiddenError('You cannot access this blog.')
        break
    }

    const blogBody = await this.blog.getBlogBody(blogId)

    if (blogInfo && blogBody) {
      return {
        ...blogInfo,
        body: blogBody
      }
    }
  }

  /**
   * Get a list of blogs information by blog ids
   * @param bids 
   * @returns Array
   */
  @Post('/List')
  async getBlogsInfo(@Body() bids: string[]) {
    const result = []
    let bid, binfo
    for (bid of bids) {
      bid = new ObjectId(bid)
      binfo = await this.blog.getBlogInfo(bid)
      switch (binfo.privacy) {
        case PRIVACY_TYPE.public:
          result.push(binfo); break
        case PRIVACY_TYPE.onlyfriend:
          // TODO: check if the user is friend of the author
          ; break
      }
    }
    return result
  }

  @Post('/Comment')
  @UseGuard(TokenGuard)
  async replyBlog(@Body() options: BlogCommentDTO) {
    // const uid = new ObjectId(this.ctx.user.id)
    let data = {
      uid: this.ctx.user.id,
      bid: new ObjectId(options.bid),
      content: options.content
    }
    let result
    if (options.cid)
      result = await this.comment.replyTo({
        ...data,
        cid: new ObjectId(options.cid),
        replywho: options.replywho ? new ObjectId(options.replywho) : undefined
      })
    else
      result = await this.comment.reply(data)

    return result ? true : false
  }

  /**
   * Like a comment in Blog.
   * @param cid 
   * @param value 
   * @returns boolean
   */
  @Post('/LikeComment')
  @UseGuard(TokenGuard)
  async likeComment(@Body() cid: string, @Body() value: boolean) {
    const cId = new ObjectId(cid)
    return await this.comment.like(cId, this.ctx.user.id, value)
  }

  /**
   * Get comments of a blog.
   * @param cid 
   * @param chunk 
   * @returns 
   */
  @Post('/GetComments')
  async getComments(@Body() cid: string, @Body() chunk?: string) {
    const cId = new ObjectId(cid)
    const blog = await this.blog.getBlogInfo(cId)
    switch (blog.privacy) {
      case PRIVACY_TYPE.onlyself:
        return new httpError.ForbiddenError('You cannot access this blog comments.')
      case PRIVACY_TYPE.onlyfriend:
        // TODO: check if the user is friend of the author
        return new httpError.ForbiddenError('You cannot access this blog comments.')
    }

    const chunkId = chunk ? new ObjectId(chunk) : undefined
    return await this.comment.getComments(cId, chunkId)
  }

  /**
   * Like a blog.
   * @param bid 
   * @param value 
   * @returns boolean
   */
  @Post('/Like')
  @UseGuard(TokenGuard)
  async likeBlog(@Body() bid: string, @Body() value: boolean) {
    const bId = new ObjectId(bid)
    return await this.blog.like(bId, this.ctx.user.id, value)
  }

  /**
   * Star a blog.
   * @param bid 
   * @param folder 
   * @returns 
   */
  @Post('/Star')
  @UseGuard(TokenGuard)
  async starBlog(@Body() bid: string, @Body() folder?: string) {
    const bId = new ObjectId(bid)
    return await this.star.star(this.ctx.user.id, bId, folder)
  }

  /**
   * Unstar a blog.
   * @param bid 
   * @param folder 
   * @param chunk 
   * @returns 
   */
  @Post('/UnStar')
  @UseGuard(TokenGuard)
  async unstarBlog(@Body() bid: string, @Body() folder?: string, @Body() chunk?: string) {
    const bId = new ObjectId(bid)
    const chunkId = chunk ? new ObjectId(chunk) : undefined
    return await this.star.unstar(this.ctx.user.id, bId, folder, chunkId)
  }

  /**
   * To share a blog.
   * @returns 
   */
  @Post('/Share')
  async shareBlog() {
    return '敬请期待'
  }

  /**
   * Get interaction between a blog and a user.
   * @param bid 
   * @returns 
   */
  @Post('/GetInteraction')
  @UseGuard(TokenGuard)
  async getInteraction(@Body() bid: string) {
    const bId = new ObjectId(bid)
    return this.blog.getInteraction(bId, this.ctx.user.id)
  }

  /**
   * Delete a blog.
   * @param bid 
   * @returns 
   */
  @Post('/Delete')
  @UseGuard(TokenGuard)
  async deleteBlog(@Body() bid: string) {
    const bId = new ObjectId(bid)
    const result = await this.blog.deleteBlog(this.ctx.user.id, bId)
    if (result === 0)
      new httpError.BadRequestError('You cannot delete this blog.')
    return result
  }
}
