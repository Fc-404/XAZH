/**
 * TODO:
 * ! Convert to 'Stored Procedure'
 */

import { Provide } from "@midwayjs/core";
import UtilList from "../model/list.util.model";
import mongoose, { Schema, Types } from "mongoose";

const list = UtilList.model

export type List = Types.ObjectId
export const List = Schema.Types.ObjectId

@Provide()
export class ListUtilService {
  /**
   * Get the head info.
   * @param head 
   * @returns 
   */
  async getHeadInfo(head: List) {
    const root = await list.findById(head)
    if (!root) return null
    return {
      chunkLen: root.chunkLen,
      totalLen: root.totalLen,
      last: root.last
    }
  }

  /**
   * Create a new list.
   * @param chunkLen
   * @param session
   * @returns ObjectId
   */
  async createList(chunkLen: number = 100, session?: mongoose.ClientSession): Promise<List> {
    if (!chunkLen) chunkLen = 100
    const result = await list.create([{
      chunkLen: chunkLen,
      totalLen: 0,
      length: 0,
      body: [],
      prev: null,
      next: null,
    }], { session })
    result[0].head = result[0].last = result[0]._id
    await result[0].save({ session })

    return result[0]._id
  }

  /**
   * Append one value to the list.
   * @param head
   * @param value
   * @param session
   * @returns true | false
   */
  async appendOne(head: List, value: any, session?: mongoose.ClientSession): Promise<boolean> {
    const root = await list.findOne({ _id: head }, ['chunkLen', 'totalLen', 'last'])
    if (!root) {
      return false
    }
    const last = await list.findOne({ _id: root.last })
    if (!last) {
      return false
    }

    let result = true
    const insession = session ?? await mongoose.startSession()
    session ?? insession.startTransaction()
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
      node.length++
      root.totalLen++

      node.markModified('body')
      await last.save({ session })
      await node.save({ session })
      await root.save({ session })
      session ?? await insession.commitTransaction()
    } catch {
      session ?? await insession.abortTransaction()
      result = false
    } finally {
      session ?? await insession.endSession()
    }

    return result
  }

  /**
   * Prepend one value to the list.
   * @param head
   * @param value
   * @param session
   */
  async prependOne(head: List, value: any, session?: mongoose.ClientSession): Promise<boolean> {
    return this.insertOne(head, value, 0, session)
  }

  /**
   * TODO: Add chunk option.
   * Insert one value to the list.
   * @param head
   * @param value
   * @param index
   * @param session
   * @returns true | false
   */
  async insertOne(head: List, value: any, index: number, session?: mongoose.ClientSession): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })
    if (!root) {
      throw new Error('List not found. That is ' + head.toString())
    }

    if (index >= root.totalLen) {
      result = await this.appendOne(head, value)
      return result
    } else if (index < 0) {
      index = 0
    }

    const insession = session ?? await mongoose.startSession()
    session ?? insession.startTransaction()
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
      session ?? await insession.commitTransaction()
    } catch {
      session ?? await insession.abortTransaction()
    } finally {
      session ?? await insession.endSession()
    }

    return result
  }

  /**
   * Delete one value from the list.
   * @param head
   * @param value
   * @param chunkid
   * @param session
   * @returns
   */
  async deleteOne(head: List, value: any, chunkid?: Types.ObjectId, session?: mongoose.ClientSession): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })
    if (!root) {
      return false
    }

    let chunk
    if (chunkid)
      chunk = await list.findOne({ _id: chunkid })

    const insession = session ?? await mongoose.startSession()
    session ?? insession.startTransaction()
    try {
      let node = root
      let index = -1

      // Search the node.
      if (chunk) {
        if (!head.equals(chunk.head))
          throw new Error('Illegal chunk.')
        // index = chunk.body.indexOf(value)
        index = chunk.body.findIndex(
          typeof value == 'function' ? value : v => v == value
        )
        if (index == -1) {
          // Search the prev chunk.
          let nextid = chunk.next
          chunk = await list.findOne({ _id: chunk.prev })
          // index = chunk.body.indexOf(value)
          index = chunk.body.findIndex(
            typeof value == 'function' ? value : v => v == value
          )
          if (index == -1) {
            // Search the next chunk.
            chunk = await list.findOne({ _id: nextid })
            // index = chunk.body.indexOf(value)
            index = chunk.body.findIndex(
              typeof value == 'function' ? value : v => v == value
            )
          }
        }
        node = chunk
      } else {
        while (node) {
          // index = node.body.indexOf(value)
          index = node.body.findIndex(
            typeof value == 'function' ? value : v => v == value
          )
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
          if (next) {
            node.body = next.body
            node.next = next.next
            node.length = next.length
            await next.deleteOne({ session })
            next = await list.findOne({ _id: node.next })
            next.prev = node._id
            next.save({ session })
          }
        } else {
          prev.next = node.next
          if (next)
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
      session ?? await insession.commitTransaction()
    } catch {
      result = false
      session ?? await insession.abortTransaction()
    } finally {
      session ?? await insession.endSession()
    }

    return result
  }

  /**
   * Find one from list.
   * @param head
   * @param value
   * @returns
   */
  async findOne(head: List, value: any) {
    let result = null
    let node = await list.findOne({ _id: head })
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
  async findByIndex(head: List, index: number) {
    let result = null
    let node = await list.findOne({ _id: head })
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
  async findByNode(head: List, nodeindex: number) {
    let result = null
    let node = await list.findOne({ _id: head })
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
   * @param head
   * @param chunk
   * @returns
   */
  async findByChunk(head: List, chunkid?: Types.ObjectId) {
    let node
    if (chunkid)
      node = await list.findOne({ _id: chunkid })
    else
      node = await list.findOne({ _id: head })
    if (!node || !node.head.equals(head))
      return {}

    return {
      value: node?.body,
      node: node?._id,
      prev: node?.prev,
      next: node?.next
    }
  }

  /**
   * Find a range of values from list.
   * @param head
   * @param start
   * @param length
   * @returns
   */
  async findMany(head: List, start: number, length: number) {
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
   * @param session
   * @returns true | false
   */
  async deleteList(head: List, session?: mongoose.ClientSession): Promise<boolean> {
    let result = true
    const root = await list.findOne({ _id: head })
    if (!root)
      return true
    if (!root.head.equals(head))
      return false

    const insession = session ?? await mongoose.startSession()
    session ?? insession.startTransaction()
    try {
      let node = root
      while (node) {
        let nextid = node.next
        await node.deleteOne({ session })
        node = await list.findOne({ _id: nextid })
      }
      session ?? await insession.commitTransaction()
    } catch {
      session ?? await insession.abortTransaction()
      result = false
    } finally {
      session ?? await insession.endSession()
    }

    return result
  }

  /**
   * Foreach a list.
   * @param head 
   * @param callback 
   * @returns 
   */
  async foreachList(head: List, callback: (value: any, index: number) => void) {
    let result = true
    let node = await list.findOne({ _id: head })
    let index = 0
    while (node) {
      node.body.forEach(v => callback(v, index++))
      node = await list.findOne({ _id: node.next })
    }
    return result
  }

  // async updateOne() { }
  // async appendMany() { }
  // async deleteMany() { }
  // async query() { }
}
