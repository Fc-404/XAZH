import {
  Controller,
  Inject,
  Post,
  UseGuard,
  Body,
  httpError,
} from '@midwayjs/core'
import { TokenGuard } from '../guard/token.guard'
import { Context } from 'koa'
import { ObjectId } from 'mongodb'

import { BlogUserService } from '../service/blog.user.service'
import { CommentBlogService } from '../service/comment.blog.service'
import { UserService } from '../service/base.user.service'
import { PRIVACY_TYPE } from '../types/privacy.types'
import { BlogCommentDTO, BlogInfoDTO, UpdateBlogDTO } from '../dto/blog.dto'
import { LevelGuard } from '../guard/level.guard'
import { USER_LEVEL } from '../types/userLevel.types'
import { Level } from '../decorator/auth/level.decorator'
import { RelationUserService } from '../service/relation.user.service'

@Controller('/Blog')
export class BlogController {
  @Inject()
  ctx: Context
  @Inject()
  blog: BlogUserService
  @Inject()
  user: UserService
  @Inject()
  rel: RelationUserService
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
    // TODO: Timed task.
    const uid = this.ctx.user.id
    const result = await this.blog.createBlog(uid, {
      title: options.title,
      author: uid,
      body: options.body,
      abstract: options.abstract,
      cover: options.cover,
      keywords: options.keywords,
      privacy: options.privacy ?? PRIVACY_TYPE.public,
      type: options.type ?? -1,
      wordcloud: options.wordcloud ?? {},
    })
    if (!result) {
      this.ctx.code = -1
    }
    return result
  }

  @Post('/Update')
  @UseGuard(TokenGuard)
  async updateBlog(@Body() options: UpdateBlogDTO) {
    if (!ObjectId.isValid(options.bid)) {
      this.ctx.code = -1
      this.ctx.status = 422
      return false
    }
    const bId = new ObjectId(options.bid)
    const result = await this.blog.updateBlog(this.ctx.user.id, bId, {
      title: options.title,
      author: this.ctx.user.id,
      body: options.body,
      abstract: options.abstract,
      cover: options.cover,
      keywords: options.keywords,
      privacy: options.privacy ?? PRIVACY_TYPE.public,
      type: options.type ?? -1,
      wordcloud: options.wordcloud ?? {},
    })
    if (!result) {
      this.ctx.code = -1
    }
    return result
  }

  /**
   * Get a blog info and body by blog id
   * @param bid
   * @returns Get info and body if success, or will have 403 error.
   */
  @Post('/Get')
  async getBlog(@Body('bid') bid: string) {
    if (!ObjectId.isValid(bid)) {
      this.ctx.status = 404
      return '无效的博客id'
    }
    const blogId = new ObjectId(bid)
    const blogInfo = await this.blog.getBlogInfo(blogId)
    if (!blogInfo) throw new httpError.NotFoundError('博客不存在')
    if (blogInfo.deleted) throw new httpError.NotFoundError('博客已删除')

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
        body: blogBody,
      }
    }
    return false
  }

  /**
   * Get a list of blogs information by blog ids
   * @param bids
   * @returns Array
   */
  @Post('/List')
  async getBlogsInfo(@Body('bids') bids: string[]) {
    if (typeof bids === 'string') bids = [bids]

    const result = {}
    let bid, binfo
    for (bid of bids) {
      if (result.hasOwnProperty(bid) || !ObjectId.isValid(bid)) continue
      bid = new ObjectId(bid)
      binfo = await this.blog.getBlogInfo(bid)
      if (!binfo) continue
      if (binfo.deleted) continue
      switch (binfo.privacy) {
        case PRIVACY_TYPE.public:
          result[bid] = {
            ...binfo,
            authorName: await this.user.id2user(binfo.author),
          }
          break
        case PRIVACY_TYPE.followers:
        // break
        case PRIVACY_TYPE.onlyfriend:
        // TODO: check if the user is friend of the author
        // break
        case PRIVACY_TYPE.onlyself:
          let uid = this.ctx.user.id
          if (uid && uid?.equals(binfo.author))
            result[bid] = {
              ...binfo,
              authorName: await this.user.id2user(binfo.author),
            }
          else result[bid] = false
          break
      }
    }
    return result
  }

  /**
   * Get user's blogs by user id.
   * @param uid
   * @param chunk
   * @returns
   */
  @Post('/GetUserBlogs')
  async getUserBlogList(
    @Body('uid') uid: string,
    @Body('chunk') chunk?: string
  ) {
    const uId = ObjectId.isValid(uid) ? new ObjectId(uid) : undefined
    if (!uId) {
      this.ctx.status = 422
      return '无效的用户id'
    }
    const chunkId = chunk
      ? ObjectId.isValid(chunk)
        ? new ObjectId(chunk)
        : undefined
      : undefined
    const blogs = await this.blog.getBlogsByUser(uId, chunkId)
    return blogs
  }

  /**
   * To comment a blog.
   * @param options
   * @returns
   */
  @Post('/Comment')
  @UseGuard(TokenGuard)
  async replyBlog(@Body() options: BlogCommentDTO) {
    if (!ObjectId.isValid(options.bid)) {
      this.ctx.status = 403
      return '无效的博客id'
    }
    if (options.replywho && !ObjectId.isValid(options.replywho)) {
      this.ctx.status = 403
      return '无效的用户id'
    }

    let data = {
      uid: this.ctx.user.id,
      bid: new ObjectId(options.bid),
      content: options.content,
    }
    let result
    if (options.cid)
      result = await this.comment.replyTo({
        ...data,
        cid: options.cid,
        replywho: options.replywho ? new ObjectId(options.replywho) : undefined,
      })
    else result = await this.comment.reply(data)

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
  async likeComment(
    @Body('cid') cid: string,
    @Body('value') value: boolean = true
  ) {
    if (!ObjectId.isValid(cid)) {
      this.ctx.status = 403
      return '无效的评论id'
    }
    const cId = new ObjectId(cid)
    let result = await this.comment.like(cId, this.ctx.user.id, value)
    if (!result) {
      this.ctx.code = -1
    }
    return result ? true : false
  }

  /**
   * Get comments of a blog.
   * @param cid
   * @param chunk
   * @returns
   */
  @Post('/GetComments')
  async getComments(
    @Body('bid') bid: string,
    @Body('cid') cid?: string,
    @Body('chunk') chunk?: string
  ) {
    if (
      !ObjectId.isValid(bid) ||
      (cid && !ObjectId.isValid(cid)) ||
      (chunk && !ObjectId.isValid(chunk))
    ) {
      this.ctx.status = 403
      return '无效的博客或评论id'
    }

    const bId = new ObjectId(bid)
    const blog = await this.blog.getBlogInfo(bId, ['privacy', 'comments'])
    switch (blog.privacy) {
      case PRIVACY_TYPE.onlyself:
        return new httpError.ForbiddenError(
          'You cannot access this blog comments.'
        )
      case PRIVACY_TYPE.onlyfriend:
        // TODO: check if the user is friend of the author
        return new httpError.ForbiddenError(
          'You cannot access this blog comments.'
        )
    }

    const chunkId = chunk ? new ObjectId(chunk) : undefined
    const { value, ...rest } = await this.comment.getComments(
      cid ?? blog.comments,
      chunkId
    )
    if (!value) return { count: 0 }

    let result = []
    for (let c of value) result.push(await this.comment.getComment(c))

    return {
      ...rest,
      count: result.length,
      body: result,
    }
  }

  /**
   * To delete a comment in Blog.
   * If provide ccid, will delete a comment-in-comment.
   * @param cid
   * @param bid
   * @param ccid
   * @param chunk
   * @returns
   */
  @Post('/DeleteComment')
  @UseGuard(TokenGuard)
  async deleteComment(
    @Body('cid') cid: string,
    @Body('bid') bid: string,
    @Body('ccid') ccid?: string,
    @Body('chunk') chunk?: string
  ) {
    if (
      !ObjectId.isValid(cid) ||
      !ObjectId.isValid(bid) ||
      (ccid && !ObjectId.isValid(ccid)) ||
      (chunk && !ObjectId.isValid(chunk))
    ) {
      this.ctx.status = 403
      return '无效的id'
    }
    const cId = new ObjectId(cid)
    const bId = new ObjectId(bid)
    const ccId = ccid ? new ObjectId(ccid) : undefined
    const chunkId = chunk ? new ObjectId(chunk) : undefined
    const isadmin = this.ctx.user.level >= USER_LEVEL.admin ? true : false

    let result
    if (ccId) {
      result = await this.comment.deleteComment(
        ccId,
        cId,
        this.ctx.user.id,
        chunkId,
        isadmin
      )
    } else {
      result = await this.comment.deleteMainComment(
        cId,
        bId,
        this.ctx.user.id,
        chunkId,
        isadmin
      )
    }
    if (!result) {
      this.ctx.status = 422
      result = '参数错误'
    } else result = '删除成功'
    return result
  }

  /**
   * Add read record to a blog,
   * if have user'id will add read record to user's read list.
   * @param bid
   * @param uid
   * @returns
   */
  @Post('/HadRead')
  async hadRead(@Body('bid') bid: string, @Body('uid') uid?: string) {
    if (!ObjectId.isValid(bid) || (uid && !ObjectId.isValid(uid))) {
      this.ctx.status = 403
      return '无效的id'
    }
    const bId = new ObjectId(bid)
    const uId = uid ? new ObjectId(uid) : undefined

    let result = await this.blog.read(bId, uId)
    if (!result) {
      this.ctx.status = 500
    }
    return result
  }

  /**
   * Like a blog.
   * @param bid
   * @param value
   * @returns boolean
   */
  @Post('/Like')
  @UseGuard(TokenGuard)
  async likeBlog(
    @Body('bid') bid: string,
    @Body('value') value: boolean = true
  ) {
    if (!ObjectId.isValid(bid)) {
      this.ctx.status = 403
      return '无效的博客id'
    }
    const bId = new ObjectId(bid)
    return await this.blog.like(bId, this.ctx.user.id, value)
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
  async getInteraction(@Body('bid') bid: string) {
    if (!ObjectId.isValid(bid)) {
      this.ctx.status = 403
      return '无效的博客id'
    }
    const bId = new ObjectId(bid)
    const result = await this.blog.getInteraction(bId, this.ctx.user.id)
    if (!result) return false
    return result
  }

  /**
   * Delete a blog.
   * @param bid
   * @returns
   */
  @Post('/Delete')
  @UseGuard(TokenGuard)
  async deleteBlog(@Body('bid') bid: string, @Body('chunk') chunk: string) {
    if (!ObjectId.isValid(bid) || (chunk && !ObjectId.isValid(chunk))) {
      this.ctx.status = 403
      return '无效的id'
    }
    const bId = new ObjectId(bid)
    const chunkId = chunk ? new ObjectId(chunk) : undefined
    const result = await this.blog.deleteBlog(this.ctx.user.id, bId, chunkId)
    if (!result) new httpError.ForbiddenError('You cannot delete this blog.')
    return result
  }

  /**
   * Administrator Api.
   * To remove thoroughly a blog.
   * @param uid
   * @param bid
   * @returns
   */
  @Post('/Drop')
  @Level(USER_LEVEL.admin)
  @UseGuard([TokenGuard, LevelGuard])
  async dropBlog(@Body('uid') uid: string, @Body('bid') bid: string) {
    if (!ObjectId.isValid(bid) || !ObjectId.isValid(uid)) {
      this.ctx.status = 403
      return '无效的id'
    }
    return this.blog.dropBlog(new ObjectId(uid), new ObjectId(bid))
  }
}
