import { Inject, Provide } from "@midwayjs/core";
import BlogInfo from "../model/info.blog.model";
import BlogComment from "../model/comment.blog.model";
import UserBlogInteraction from "../model/interaction.blog.user.model";
import { ListUtilService } from "./list.util.service";
import { LogService } from "./log.service";
import mongoose, { Types } from "mongoose";
import { ICommentBlog, ICommentToBlog } from "../interface/comment.blog.interface";

@Provide()
export class CommentBlogService {
  @Inject()
  list: ListUtilService
  @Inject()
  log: LogService

  /**
   * Initialize comment list.
   * @param blog 
   * @returns 
   */
  async initComment(blog: any) {
    blog.comments = await this.list.createList()
    return blog.save()
  }

  /**
   * Get comment chunk one by one.
   * @param bid 
   * @param chunk 
   * @returns 
   */
  async getComments(bid: Types.ObjectId, chunk?: Types.ObjectId) {
    const blog = await BlogInfo.model.findById(bid)
    if (!blog.comments) {
      this.initComment(blog)
    }
    return this.list.findByChunk(blog.comments, chunk)
  }

  /**
   * Get a comment by id.
   * @param cid 
   * @returns 
   */
  async getComent(cid: Types.ObjectId) {
    return BlogComment.model.findById(cid)
  }
  /**
   * Get a comment without content.
   * @param cid 
   * @returns 
   */
  async getCommentWithoutContent(cid: Types.ObjectId) {
    return BlogComment.model.findById(cid, { content: 0 })
  }

  /**
   * Reply comment to Blog.
   * @param options 
   */
  async reply(options: ICommentBlog) {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const wholikeList = await this.list.createList(null, session)
      const comment = await BlogComment.model.create([{
        bid: options.bid,
        author: options.uid,
        content: options.content,
        wholike: wholikeList
      }], { session })
      const blog = await BlogInfo.model.findById(options.bid)
      await this.list.prependOne(blog.comments, comment[0]._id, session)
      blog.commentcount++
      await blog.save({ session })

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('reply() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Reply to the comment in Blog.
   * @param options 
   */
  async replyTo(options: ICommentToBlog) {
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // create a new comment for blog's main comment
      const wholikeList = await this.list.createList(null, session)
      const comment = await BlogComment.model.create([{
        bid: options.bid,
        cid: options.cid,
        replywho: options.replywho,
        author: options.uid,
        content: options.content,
        wholike: wholikeList
      }], { session })
      // prepend the new comment to the blog's main comment
      const commentObj = await BlogComment.model.findById(options.cid)
      if (!commentObj.subcomments) {
        commentObj.subcomments = await this.list.createList(null, session)
      }
      await this.list.prependOne(commentObj.subcomments, comment[0]._id, session)
      // counter
      commentObj.subcount++

      await commentObj.save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('replyTo() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Delete a comment in blog.
   * @param id 
   * @param cid 
   */
  async deleteMainComment(cid: Types.ObjectId, bid: Types.ObjectId, chunk?: Types.ObjectId) {
    const blog = await BlogInfo.model.findById(bid)
    const comment = await BlogComment.model.findById(cid)
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.deleteList(comment.wholike, session)
      await this.list.deleteList(comment.subcomments, session)
      await this.list.deleteOne(blog.comments, cid, chunk, session)
      blog.commentcount--
      await blog.save({ session })

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('deleteMainComment() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Delete a comment in comment.
   * @param ccid 
   * @param cid 
   * @param chunk 
   */
  async deleteComment(ccid: Types.ObjectId, cid: Types.ObjectId, chunk?: Types.ObjectId) {
    const commentObj = await BlogComment.model.findById(cid)
    const comment = await BlogComment.model.findById(ccid)
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.deleteList(comment.wholike, session)
      await this.list.deleteOne(commentObj.subcomments, ccid, chunk, session)
      commentObj.subcount--
      await commentObj.save({ session })

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('deleteComment() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Delete all comments in blog.
   * @param bid 
   */
  async deleteAll(bid: Types.ObjectId) {
    const blog = await BlogInfo.model.findById(bid)
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.foreachList(blog.comments,
        async (v) => {
          let comment = await BlogComment.model.findById(v)
          await this.list.deleteList(comment.wholike, session)
          if (!comment.cid)
            await this.list.deleteList(comment.subcomments, session)
        }
      )
      await this.list.deleteList(blog.comments, session)

      await session.commitTransaction()
    } catch (e) {
      await this.log.red('deleteAll() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
  }

  /**
   * Like comment.
   * @param id 
   * @param uid 
   * @param value 
   */
  async like(cid: Types.ObjectId, uid: Types.ObjectId | null, value: boolean = true) {
    const comment = await BlogComment.model.findById(cid)
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      comment.likecount = comment.likecount + (value ? 1 : -1)
      comment.save({ session })
      // Add uid to wholike list in comment schema.
      if (uid) {
        await this.list.prependOne(comment.wholike, uid, session)
      }
      // Set islike status to Interaction.blog.user schema.
      await UserBlogInteraction.model.findOneAndUpdate(
        { _id: uid.toString() + comment.bid.toString() },
        { $set: { 'comment.$[element].islike': value } },
        {
          session,
          'arrayFilters': [{ 'element._id': cid }],
          upsert: true
        }
      )
    } catch (e) {
      result = false
      await this.log.red('like() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }
}
