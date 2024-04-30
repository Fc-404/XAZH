/**
 * This service is for user's blog.
 * Not for User.Blog model.
 */

import { Inject, Provide } from '@midwayjs/core'

import UserBlog from '../model/blog.user.model'
import UserBlogRead from '../model/read.blog.user.model'
import UserBlogLike from '../model/like.blog.user.model'
import UserBlogInteraction from '../model/interaction.blog.user.model'
import BlogInfo from '../model/info.blog.model'
import BlogBody from '../model/body.blog.model'
import { LogService } from './log.service'
import { List, ListUtilService } from './list.util.service'
import { CommentBlogService } from './comment.blog.service'
import { StarBlogUserService } from './star.blog.user.service'
import { IBlogInfo } from '../interface/blog.interface'
import mongoose, { Types } from 'mongoose'

@Provide()
export class BlogUserService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService
  @Inject()
  blogStar: StarBlogUserService
  @Inject()
  comment: CommentBlogService

  /**
   * Checks whether exist the blog.
   * if provide a user's id,
   * checks whether the blog belongs to the user.
   * @param id
   * @param uid
   * @return boolean
   */
  async hasBlog(id: Types.ObjectId, uid?: Types.ObjectId): Promise<boolean> {
    const blog = await BlogInfo.model.findById(id)
    if (!blog) {
      return false
    }
    return !(uid && uid.equals(blog.author))
  }

  /**
   * Initialize blogs list.
   * @param bu
   */
  async initBlogs(bu: any): Promise<List> {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (!bu.blogs)
        bu.blogs = await this.list.createList(
          UserBlog.name + '/blogs',
          null,
          session
        )
      await bu.save({ session })
      await session.commitTransaction()
    } catch (e) {
      await this.log.red('initBlogs() execution error in BlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return bu.blogs
  }

  /**
   * Create a new blog.
   * @param uid
   * @param options
   * @returns Boolean
   */
  async createBlog(
    uid: Types.ObjectId,
    options: IBlogInfo
  ): Promise<Types.ObjectId | undefined> {
    let result
    const bu = await UserBlog.model.findById(uid)
    if (bu && !bu.blogs) await this.initBlogs(bu)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { body, ...rest } = options
      const blogInfoResult = await BlogInfo.model.create(
        [
          {
            ...rest,
          },
        ],
        { session }
      )
      await this.list.prependOne(bu.blogs, blogInfoResult[0]._id, session)
      // blog body
      const blogBodyResult = await BlogBody.model.create(
        [
          {
            _id: blogInfoResult[0]._id,
            content: body,
          },
        ],
        { session }
      )
      blogInfoResult[0].body = blogBodyResult[0]._id
      // blog countlist
      const wholikeListId = await this.list.createList(
        BlogInfo.name + '/wholike',
        1000,
        session
      )
      const whostarListId = await this.list.createList(
        BlogInfo.name + '/whostar',
        1000,
        session
      )
      blogInfoResult[0].wholike = wholikeListId
      blogInfoResult[0].whostar = whostarListId

      // Add record to user.blog
      await UserBlog.model.updateOne(
        { _id: uid },
        { $inc: { blogcount: 1 } },
        { session }
      )

      await blogInfoResult[0].save({ session })
      await session.commitTransaction()
      result = blogInfoResult[0]._id
    } catch (e) {
      await this.log.red('createBlog() execution error in BlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Update a blog.
   * @param uid
   * @param bid
   * @param options
   * @returns
   */
  async updateBlog(
    uid: Types.ObjectId,
    bid: Types.ObjectId,
    options: IBlogInfo
  ): Promise<boolean> {
    const blog = await BlogInfo.model.findById(bid)
    if (!blog) return false
    if (!uid.equals(blog.author)) return false
    const { body, date, author, ...rest } = options
    if (body) {
      const blogBody = await BlogBody.model.findById(blog.body)
      if (!blogBody) return false
      blogBody.content = body
      let r = await blogBody.save()
      if (!r) return false
    }
    Object.keys(rest).forEach((key) => {
      blog[key] = rest[key]
    })
    blog.markModified('keywords')
    blog.markModified('wordcloud')
    const r = await blog.save()
    return r ? true : false
  }

  /**
   * Delete a blog by id.
   * But not truely delete it.
   * Just maker it as deleted.
   * @param uid
   * @param bid
   * @returns boolean | 0
   */
  async deleteBlog(
    uid: Types.ObjectId,
    bid: Types.ObjectId,
    chunk?: Types.ObjectId
  ): Promise<boolean> {
    const blog = await BlogInfo.model.findById(bid)
    if (!uid.equals(blog.author)) return false

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      blog.deleted = true
      await blog.save({ session })
      const userBlog = await UserBlog.model.findById(uid)
      await userBlog.updateOne({ $inc: { blogcount: -1 } }, { session })
      await this.list.deleteOne(
        userBlog.blogs,
        (v) => bid.equals(v),
        chunk,
        session
      )
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('deleteBlog() execution error in BlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Thorough delete a blog by id.
   * Do not use unless necessary.
   * @param id
   * @return boolean
   */
  async dropBlog(
    uid: Types.ObjectId,
    id: Types.ObjectId,
    chunk?: Types.ObjectId
  ): Promise<boolean> {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const userBlog = await UserBlog.model.findById(uid)
      await this.list.deleteOne(
        userBlog.blogs,
        (v) => id.equals(v),
        chunk,
        session
      )

      const blogInfo = await BlogInfo.model.findById(id)
      if (blogInfo) {
        await this.list.deleteList(blogInfo.comments, session)
        // blog countlist
        await this.list.deleteList(blogInfo.wholike, session)
        await this.list.deleteList(blogInfo.whostar, session)
        // blog body
        await BlogBody.model.deleteOne({ _id: id }, { session })
        // blog comment
        await this.comment.deleteAll(id)
        if (!(await blogInfo.deleteOne({ session })))
          throw 'Delete all comment in blog failed!'
      }

      await session.commitTransaction()
    } catch (e) {
      await this.log.red('dropBlog() execution error in BlogUserService.', e)
      await session.abortTransaction()
      result = false
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Get blog's info without body.
   * @param id
   * @return object
   */
  async getBlogInfo(id: Types.ObjectId, filter?: any): Promise<any> {
    return BlogInfo.model.findOne(id, filter).lean()
  }

  /**
   * Get user's blogs.
   * @param uid
   * @param chunk
   * @returns
   */
  async getBlogsByUser(
    uid: Types.ObjectId,
    chunk?: Types.ObjectId
  ): Promise<any> {
    const b = await UserBlog.model.findById(uid)
    if (!b) return null
    const blogs = await this.list.findByChunk(b.blogs, chunk)
    return {
      readcount: b.readcount,
      likecount: b.likecount,
      starcount: b.starcount,
      blogcount: b.blogcount,
      ...blogs,
    }
  }

  /**
   * Get blog's body only.
   * @param id
   * @return string
   */
  async getBlogBody(id: Types.ObjectId): Promise<string> {
    return (await BlogBody.model.findById(id)).content
  }

  /**
   * Set read record for the blog.
   * @param id
   * @param uid
   */
  async read(id: Types.ObjectId, uid?: Types.ObjectId): Promise<boolean> {
    // Add read count for the blog.info
    const blog = await BlogInfo.model.findById(id)
    blog.readcount++
    blog.save()
    await UserBlog.model.updateOne(
      { _id: blog.author },
      { $inc: { readcount: 1 } }
    )
    if (!uid) return true

    // Add read record for the user.blog.read
    const userBlogRead = await UserBlogRead.model.findById(uid)
    if (!userBlogRead) {
      await this.log.yellow('The uid or uid.read is invalid in read().')
      throw null
    }
    if (id.equals(userBlogRead.list.pop())) return true
    await userBlogRead.updateOne({
      $push: {
        list: {
          $each: [id],
          $slice: -UserBlogRead.listMax,
        },
      },
    })

    return true
  }

  /**
   * Set like record for the blog.
   * This function is irreversible for data, except data of blog.likecount.
   * @param id
   * @param uid
   * @param value
   */
  async like(
    id: Types.ObjectId,
    uid: Types.ObjectId,
    value: boolean = true
  ): Promise<boolean> {
    // Add like count for the blog.info
    const blog = await BlogInfo.model.findById(id)
    if (!blog) return false
    let interaction = await UserBlogInteraction.model.findById(
      uid.toString() + id.toString()
    )
    if (!interaction) {
      interaction = await UserBlogInteraction.model.create({
        _id: uid.toString() + id.toString(),
      })
    } else if (interaction.islike === value) {
      return true
    }

    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Add like record for the user.blog.interaction
      interaction.islike = value
      await interaction.save({ session })

      blog.likecount = blog.likecount + (value ? 1 : -1)
      await blog.save({ session })

      if (value) {
        // Add like record for the blog.countlist
        await this.list.prependOne(blog.wholike, uid, session)

        // Add like record for the user.blog.like
        const userBlogLike = await UserBlogLike.model.findById(uid)
        if (!id.equals(userBlogLike.list.pop()))
          await userBlogLike.updateOne(
            {
              $push: {
                list: {
                  $each: [id],
                  $slice: -UserBlogLike.listMax,
                },
              },
            },
            { session }
          )

        // Add like record for the user.blog
        await UserBlog.model.updateOne(
          { _id: blog.author },
          { $inc: { likecount: 1 } },
          { session }
        )
      }

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('like() execution error in BlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Get interaction information between user and blog.
   * @param id
   * @param uid
   * @returns
   */
  async getInteraction(id: Types.ObjectId, uid: Types.ObjectId) {
    return UserBlogInteraction.model
      .findById(uid.toString() + id.toString())
      .lean()
  }

  /**
   * Disable the blog.
   * @param id
   */
  async disable(id: Types.ObjectId) {
    const blog = await BlogInfo.model.findById(id)
    blog.disabled = true
    return blog.save()
  }

  /**
   * Enable the blog.
   * @param id
   */
  async enable(id: Types.ObjectId) {
    const blog = await BlogInfo.model.findById(id)
    blog.disabled = false
    return blog.save()
  }

  /**
   * Get blogs by order.
   * @param index
   * @param step
   * @param order
   * @returns
   */
  async getBlogsByOrder(
    index: number = 0,
    step: number = 20,
    order: boolean = false
  ) {
    const blogs = await BlogInfo.model
      .find()
      .sort({ _id: order ? 1 : -1 })
      .skip(index)
      .limit(step)

    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].deleted || blogs[i].disabled) {
        blogs.splice(i--, 1)
      }
    }

    return blogs
  }
}
