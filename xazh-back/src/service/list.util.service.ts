/**
 * TODO:
 * ! Convert to 'Stored Procedure'
 */

import { Provide } from "@midwayjs/core";
import UtilList from "../model/list.util.model";
import mongoose, { Types } from "mongoose";

const list = UtilList.model

@Provide()
export class ListUtilService {
  /**
   * Create a new list.
   * @param chunkLen 
   * @returns ObjectId
   */
  async createList(chunkLen: number = 100): Promise<Types.ObjectId> {
    const result = await list.create({
      chunkLen: chunkLen,
      totalLen: 0,
      length: 0,
      body: [],
      prev: null,
      next: null,
    })
    result.head = result.last = result._id
    await result.save()

    return result._id
  }

  /**
   * Append one value to the list.
   * @param id 
   * @param value 
   * @returns true | false
   */
  async appendOne(head: Types.ObjectId, value: any): Promise<boolean> {
    const root = await list.findOne({ _id: head }, ['chunkLen', 'totalLen', 'last'])
    const last = await list.findOne({ _id: root.last })
    if (!last) {
      // TODO: Log system.
      return false
    }
    let result = true
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      let node = last
      if (last.length >= root.chunkLen) {
        node = (await list.create([{
          head: root._id,
          length: 0,
          body: [],
          prev: last._id,
          next: null,
        }], { session }))[0]
        root.last = last.next = node._id
      }
      node.body.push(value)
      node.markModified('body')
      node.length++
      root.totalLen++

      await last.save({ session })
      await node.save({ session })
      await root.save({ session })
      await session.commitTransaction()
    } catch {
      await session.abortTransaction()
      result = false
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Insert one value to the list.
   * @param head 
   * @param value 
   * @param index 
   * @returns true | false
   */
  async insertOne(head: Types.ObjectId, value: any, index: number): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })

    if (index >= root.totalLen) {
      result = await this.appendOne(head, value)
      return result
    } else if (index < 0) {
      index = 0
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Search the node.
      let node = root
      let count = 0
      while (node) {
        count += node.length
        if (count >= index)
          break
        node = await list.findOne({ _id: node.next })
      }
      index -= count
      if (!node) {
        // TODO: Log system.
        return false
      }
      // Insert.
      node.body.splice(index, 0, value)
      node.markModified('body')
      node.length++
      root.totalLen++
      // Check.
      if (node.length >= root.chunkLen * 2) {
        const next = (await list.create([{
          head: root._id,
          length: 0,
          body: [],
          prev: node._id,
          next: null,
        }], { session }))[0]
        next.next = node.next
        node.next = next._id
        next.body = node.body.splice(root.chunkLen)
        node.markModified('body')
        next.length = node.length - root.chunkLen
        node.length = root.chunkLen
        await next.save({ session })
      }
      await node.save({ session })
      await root.save({ session })
      await session.commitTransaction()
    } catch {
      // TODO: Log system.
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Delete one value from the list.
   * @param head 
   * @param value 
   * @returns 
   */
  async deleteOne(head: Types.ObjectId, value: any, chunkid?: Types.ObjectId): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })
    const chunk = await list.findOne({ _id: chunkid })

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let node = root
      let index

      // Search the node.
      if (chunk) {
        node = chunk
        index = chunk.body.indexOf(value)
      } else {
        while (node) {
          index = node.body.indexOf(value)
          if (index != -1)
            break
          node = await list.findOne({ _id: node.next })
        }
      }
      if (!node || index == -1) {
        result = false
        throw new Error('Not found.')
      }

      // Delete logic.
      node.body.splice(index, 1)
      node.markModified('body')
      node.length--
      root.totalLen--
      let next = await list.findOne({ _id: node.next })
      let prev = await list.findOne({ _id: node.prev })
      if (node.length <= 0) {
        if (node == root) {
          node.body = next.body
          node.next = next.next
          node.length = next.length
          await next.deleteOne({ session })
          next = await list.findOne({ _id: node.next })
          next.prev = node._id
          next.save({ session })
        } else {
          prev.next = node.next
          next.prev = prev._id
          await prev.save({ session })
          await next.save({ session })
          await node.deleteOne({ session })
        }
      } else {
        let prevL = prev?.length
        let nextL = next?.length
        let nodeL = node.length
        if (prevL && prevL + nodeL <= root.chunkLen * 1.5) {
          prev.body.push(...node.body)
          prev.markModified('body')
          prev.length += nodeL
          prev.next = next._id
          next.prev = prev._id
          node.deleteOne({ session })
          await prev.save({ session })
          await next.save({ session })
        } else if (nextL && nextL + nodeL <= root.chunkLen * 1.5) {
          next.body.unshift(...node.body)
          next.markModified('body')
          next.length += nodeL
          next.prev = prev._id
          prev.next = next._id
          node.deleteOne({ session })
          await next.save({ session })
          await prev.save({ session })
        } else {
          await node.save({ session })
        }
      }

      await root.save({ session })
      await session.commitTransaction()
    } catch (e) {
      console.log(e);
      // TODO: Log system.
      result = false
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }

    return result
  }

  /**
   * Find one from list.
   * @param head 
   * @param value 
   * @returns 
   */
  async findOne(head: Types.ObjectId, value: any) {
    let result = null
    const root = await list.findOne({ _id: head })

    let node = root
    let count = 0
    while (node) {
      let index = node.body.indexOf(value)
      if (index != -1) {
        result = {
          value: value,
          index: count + index,
          node: node._id,
        }
        break
      } else {
        count += node.length
        node = await list.findOne({ _id: node.next })
      }
    }

    return result
  }

  /**
   * Fine one by index from list.
   * @param head 
   * @param index 
   * @returns 
   */
  async findByIndex(head: Types.ObjectId, index: number) {
    let result = null
    const root = await list.findOne({ _id: head })

    let node = root
    let count = 0
    while (node) {
      let recount = count
      if (index < count) {
        result = {
          value: node.body[index - recount],
          node: node._id,
        }
        break
      }
      count += node.length
      node = await list.findOne({ _id: node.next })
    }

    return result
  }

  /**
   * Find a chunk from list.
   * @param head 
   * @param nodeindex 
   * @returns 
   */
  async findByNode(head: Types.ObjectId, nodeindex: number) {
    let result = null
    const root = await list.findOne({ _id: head })

    let node = root
    let index = 0
    while (node) {
      if (nodeindex == index) {
        result = {
          value: node.body,
          node: node._id,
          prev: node.prev,
          next: node.next
        }
        break
      }
      node = await list.findOne({ _id: node.next })
      index++
    }

    return result
  }

  /**
   * Find a chunk by id.
   * @param chunk 
   * @returns 
   */
  async findByChunk(chunk: Types.ObjectId) {
    const node = await list.findOne({ _id: chunk })
    let result = {
      value: node.body,
      node: node._id,
      prev: node.prev,
      next: node.next
    }

    return result
  }

  /**
   * Find a range of values from list.
   * @param head 
   * @param start 
   * @param end 
   * @returns 
   */
  async findMany(head: Types.ObjectId, start: number, length: number) {
    if (start < 0 || length <= 0) {
      return null
    }

    let result = {
      value: [],
      node: [],
      length: 0,
    }
    const root = await list.findOne({ _id: head })

    let node = root
    let count = 0
    while (node) {
      let recount = count
      count += node.length
      if (result.length >= length) break
      // Push.
      if (start == -1) {
        let nlen = node.length
        let remainder = length - result.length
        // Done.
        if (remainder <= nlen) {
          result.value.push(...node.body.slice(0, remainder))
          result.length += remainder
          break
        }
        // Continue.
        else {
          result.value.push(...node.body)
          result.length += nlen
        }
      }
      // Start.
      if (start != -1 && count >= start) {
        let index = start - recount
        let remainder = node.length - index
        if (remainder < length) {
          result.value.push(...node.body.slice(index))
          result.length = remainder
          start = -1
        } else {
          result.value.push(...node.body.slice(index, index + length))
          result.length = length
          break
        }
      }

      node = await list.findOne({ _id: node.next })
    }

    return result
  }

  /**
   * Delete a list.
   * @param head 
   * @returns true | false
   */
  async deleteList(head: Types.ObjectId): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let node = root
      while (node) {
        let nextid = node.next
        await node.deleteOne({ session })
        node = await list.findOne({ _id: nextid })
      }
      await session.commitTransaction()
    } catch {
      // TODO: Log system.
      await session.abortTransaction()
      result = false
    } finally {
      await session.endSession()
    }

    return result
  }

  // async updateOne() { }
  // async appendMany() { }
  // async deleteMany() { }
  // async query() { }
}