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
   * Get comment chunk one by one.
   * @param id 
   * @param chunk 
   * @returns 
   */
  async getComments(id: Types.ObjectId, chunk?: Types.ObjectId) {
    return this.list.findByChunk(id, chunk)
  }

  /**
   * Get a comment by id.
   * @param cid 
   * @returns 
   */
  async getComment(cid: Types.ObjectId) {
    return BlogComment.model.findById(cid).lean()
  }
  /**
   * Get a comment without content.
   * @param cid 
   * @returns 
   */
  async getCommentWithoutContent(cid: Types.ObjectId) {
    return BlogComment.model.findById(cid, { content: 0 }).lean()
  }

  /**
   * Reply comment to Blog.
   * @param options 
   */
  async reply(options: ICommentBlog) {
    let result = true
    let commentsList
    const blog = await BlogInfo.model.findById(options.bid)
    if (!blog) throw new Error('Blog not found.')
    if (blog.deleted) throw new Error('Blog has been deleted.')
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
      if (!blog.comments) {
        blog.comments = commentsList = await this.list.createList()
      }
      await this.list.prependOne(blog.comments, comment[0]._id, session)
      blog.commentcount++
      await blog.save({ session })

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.list.deleteList(commentsList)
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
    let commentList
    const commentObj = await BlogComment.model.findById(options.cid)
    if (!commentObj) throw new Error('Comment not found.')
    const blog = await BlogInfo.model.findById(options.bid)
    if (blog && blog.deleted) throw new Error('Blog has been deleted.')

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
      if (!commentObj.subcomments) {
        commentObj.subcomments = commentList = await this.list.createList()
      }
      await this.list.prependOne(commentObj.subcomments, comment[0]._id, session)
      // counter
      commentObj.subcount++

      await commentObj.save({ session })
      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.list.deleteList(commentList)
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
  async deleteMainComment(cid: Types.ObjectId, bid: Types.ObjectId,
    uid: Types.ObjectId, chunk?: Types.ObjectId, isadmin: boolean = false): Promise<boolean> {
    const blog = await BlogInfo.model.findById(bid)
    const comment = await BlogComment.model.findById(cid)
    if (!blog) return false
    if (!comment) return false
    if (!isadmin && !comment.author.equals(uid)) return false
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.deleteList(comment.wholike, session)
      await this.list.deleteList(comment.subcomments, session)
      await comment.deleteOne({ session })
      const r = await this.list.deleteOne(blog.comments, v => cid.equals(v), chunk, session)
      if (!r) throw new Error('Delete comment failed.')
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
  async deleteComment(ccid: Types.ObjectId, cid: Types.ObjectId,
    uid: Types.ObjectId, chunk?: Types.ObjectId, isadmin: boolean = false): Promise<number> {
    const commentObj = await BlogComment.model.findById(cid)
    const comment = await BlogComment.model.findById(ccid)
    if (!comment || !commentObj) return 1
    if (!comment.author.equals(uid)) return 2
    if (!isadmin && !comment.cid.equals(commentObj._id)) return 3
    let result = 0
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.deleteList(comment.wholike, session)
      await comment.deleteOne({ session })
      const r = await this.list.deleteOne(commentObj.subcomments, v => ccid.equals(v), chunk, session)
      if (!r) throw new Error('Delete subcomment failed.')
      commentObj.subcount--
      await commentObj.save({ session })

      await session.commitTransaction()
    } catch (e) {
      result = -1
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
    let result = true
    const blog = await BlogInfo.model.findById(bid)
    if (!blog) throw new Error('Blog not found.')
    if (blog.deleted) throw new Error('Blog has been deleted.')
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await this.list.foreachList(blog.comments,
        async (v) => {
          let comment = await BlogComment.model.findById(v)
          await this.list.deleteList(comment?.wholike, session)
          if (!comment?.cid)
            await this.list.deleteList(comment?.subcomments, session)
        }
      )
      await this.list.deleteList(blog.comments, session)

      await session.commitTransaction()
    } catch (e) {
      result = false
      await this.log.red('deleteAll() execution error in CommentBlogService.', e)
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
    return result
  }

  /**
   * Like comment.
   * @param id 
   * @param uid 
   * @param value 
   */
  async like(cid: Types.ObjectId, uid: Types.ObjectId, value: boolean = true) {
    const comment = await BlogComment.model.findById(cid)
    if (!comment) return false

    let result = true
    let interaction = await UserBlogInteraction.model.findById(uid.toString() + comment.bid.toString())
    if (!interaction) {
      interaction = await UserBlogInteraction.model.create({
        _id: uid.toString() + comment.bid.toString(),
      })
    } else if (interaction.comment[cid.toString()]?.islike === value) {
      return true
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Set islike status to Interaction.blog.user schema.
      interaction.comment[cid.toString()] = { islike: value }
      interaction.markModified('comment')
      await interaction.save({ session })

      comment.likecount = comment.likecount + (value ? 1 : -1)
      await comment.save({ session })
      // Add uid to wholike list in comment schema.
      if (value) {
        await this.list.prependOne(comment.wholike, uid, session)
      }

      await session.commitTransaction()
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
