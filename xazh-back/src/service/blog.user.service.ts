/**
 * This service is for user's blog.
 * Not for User.Blog model.
 */

import { Inject, Provide } from "@midwayjs/core";

import UserBlog from "../model/blog.user.model";
import UserBlogRead from "../model/read.blog.user.model";
import UserBlogLike from "../model/like.blog.user.model";
import UserBlogInteraction from "../model/interaction.blog.user.model";
import BlogInfo from "../model/info.blog.model";
import BlogBody from "../model/body.blog.model";
import BlogCountlist from "../model/countlist.blog.model";
import { LogService } from "./log.service";
import { List, ListUtilService } from "./list.util.service";
import { CommentBlogService } from "./comment.blog.service";
import { StarBlogUserService } from "./star.blog.user.service";
import { IBlogInfo } from "../interface/blog.interface";
import mongoose, { Types } from "mongoose";


@Provide()
export class BlogUserService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService;
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
        bu.blogs = await this.list.createList(null, session)
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
  async createBlog(uid: Types.ObjectId, options: IBlogInfo): Promise<boolean> {
    let result = true
    const bu = await UserBlog.model.findById(uid)
    if (bu && !bu.blogs)
      await this.initBlogs(bu)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { body, ...rest } = options
      const blogInfoResult = await BlogInfo.model.create([{
        ...rest,
      }], { session })
      await this.list.prependOne(bu.blogs, blogInfoResult[0]._id, session)
      // blog body
      const blogBodyResult = await BlogBody.model.create([{
        _id: blogInfoResult[0]._id,
        content: body
      }], { session })
      blogInfoResult[0].body = blogBodyResult[0]._id
      // blog countlist
      const wholikeListId = this.list.createList(null, session)
      const whostarListId = this.list.createList(null, session)
      await BlogCountlist.model.create([{
        _id: blogInfoResult[0]._id,
        wholike: wholikeListId,
        whostar: whostarListId,
      }], { session })

      await blogInfoResult[0].save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('createBlog() execution error in BlogUserService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Delete a blog by id.
   * But not truely delete it.
   * Just maker it as deleted.
   * @param uid
   * @param bid
   * @returns boolean | 0
   */
  async deleteBlog(uid: Types.ObjectId, bid: Types.ObjectId): Promise<boolean | 0> {
    const blog = await BlogInfo.model.findById(bid)
    if (!uid.equals(blog.author))
      return false
    blog.deleted = true
    const result = blog.save()
    return result ? true : false
  }

  /**
   * Thorough delete a blog by id.
   * Do not use unless necessary.
   * @param id
   * @return boolean
   */
  async dropBlog(id: Types.ObjectId): Promise<boolean> {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const blogInfo = await BlogInfo.model.findById(id)
      await this.list.deleteList(blogInfo.comments, session)
      // blog countlist
      const blogCountList = await BlogCountlist.model.findById(id)
      await this.list.deleteList(blogCountList.wholike, session)
      await this.list.deleteList(blogCountList.whostar, session)
      // blog body
      await BlogBody.model.deleteOne({ _id: id }, { session })
      // blog comment
      await this.comment.deleteAll(id)
      await blogInfo.deleteOne({ session })

      await session.commitTransaction()
    } catch (e) {
      await this.log.red('deleteBlog() execution error in BlogUserService.', e)
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
  async getBlogInfo(id: Types.ObjectId): Promise<any> {
    return BlogInfo.model.findById(id)
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
    if (!uid)
      return true

    // Add read record for the user.blog.read
    const userBlogRead = await UserBlogRead.model.findById(
      (await UserBlog.model.findById(uid)).read
    )
    if (!userBlogRead) {
      await this.log.yellow('The uid or uid.read is invalid in read().')
      throw null
    }
    if (userBlogRead.list.length >= UserBlogRead.listMax) {
      await userBlogRead.updateOne({
        $pop: {
          list: {
            $each: [],
            $slice: UserBlogRead.listMax - userBlogRead.list.length
          }
        }
      })
    }
    await userBlogRead.updateOne({ $push: { list: id } })

    return true
  }

  /**
   * Set like record for the blog.
   * This function is irreversible for data, except data of blog.likecount.
   * @param id
   * @param uid
   * @param value
   */
  async like(id: Types.ObjectId, uid: Types.ObjectId, value: boolean = true): Promise<boolean> {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Add like count for the blog.info
      const blog = await BlogInfo.model.findById(id)
      blog.likecount = blog.likecount + (value ? 1 : -1)
      blog.save({ session })

      if (value) {
        // Add like record for the blog.countlist
        const countlist = await BlogCountlist.model.findById(id)
        await this.list.prependOne(countlist.wholike, uid, session)

        // Add like record for the user.blog.like
        const userBlogLike = await UserBlogLike.model.findById(uid)
        if (userBlogLike.list.length >= UserBlogLike.listMax) {
          let r = await userBlogLike.updateOne({
            $pop: {
              list: {
                $each: [],
                $slice: UserBlogLike.listMax - userBlogLike.list.length
              }
            }
          })
          if (!r)
            await this.log.yellow('Failed to delete redundant records in BlogUserService.like().')
        }
        await userBlogLike.updateOne({ $push: { list: id } }, { session })
      }

      // Add like record for the user.blog.interaction
      await UserBlogInteraction.model.findOneAndUpdate(
        { _id: uid.toString() + id.toString() },
        { $set: { like: value } },
        { session, upsert: true }
      )

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
   * Star the blog.
   * @param id 
   * @param uid 
   * @param value 
   * @param folder 
   * @param chunk 
   */
  async star(id: Types.ObjectId, uid: Types.ObjectId,
    value: boolean = true, folder?: string, chunk?: Types.ObjectId): Promise<boolean> {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const blog = await BlogInfo.model.findById(id)
      blog.starcount = blog.starcount + (value ? 1 : -1)
      blog.save({ session })

      let r
      // Add or remove like record for the user.blog.star
      if (value) {
        r = await this.blogStar.star(uid, id, folder)
        // Add like record for the blog.countlist
        const countlist = await BlogCountlist.model.findById(id)
        await this.list.prependOne(countlist.whostar, uid, session)
      } else
        r = await this.blogStar.unstar(uid, id, folder, chunk)
      if (!r) {
        await this.log.red('star or unstar execution error in BlogUserService.star().')
        throw null
      }

      // Add like record for the user.blog.interaction
      await UserBlogInteraction.model.findOneAndUpdate(
        { _id: uid.toString() + id.toString() },
        { $set: { star: value } },
        { session, upsert: true }
      )

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('star() execution error in BlogUserService.', e)
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
    return UserBlogInteraction.model.findById(id.toString() + uid.toString())
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
}
