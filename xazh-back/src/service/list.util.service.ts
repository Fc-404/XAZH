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
   * @returns 
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

      await node.save({ session })
      await root.save({ session })
      session.commitTransaction()
    } catch {
      await session.abortTransaction()
      result = false
    } finally {
      session.endSession()
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
        next.body = node.body.splice(root.chunkLen + 1)
        node.markModified('body')
        next.length = node.length - root.chunkLen
        node.length = root.chunkLen
        await next.save({ session })
      }
      await node.save({ session })
      await root.save({ session })
      session.commitTransaction()
    } catch {
      // TODO: Log system.
      await session.abortTransaction()
    } finally {
      session.endSession()
    }

    return result
  }

  /**
   * Delete one value from the list.
   * @param head 
   * @param value 
   * @returns 
   */
  async deleteOne(head: Types.ObjectId, value: any) {
    let result = true
    const root = await list.findOne({ _id: head })

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      let node = root
      let prev = root
      while (node) {
        let index = node.body.indexOf(value)
        if (index != -1) {
          node.body.splice(index, 1)
          node.markModified('body')
          node.length--
          root.totalLen--
          if (node.length === 0) {
            if (node.next) {
              prev.next = node.next
            }
            else {
              prev.next = null
              root.last = prev._id
            }
            await node.deleteOne({ session })
          } else {
            await node.save({ session })
          }
          await root.save({ session })
          break
        } else {
          prev = node
          node = await list.findOne({ _id: node.next })
        }
      }
      session.commitTransaction()
    } catch {
      // TODO: Log system.
      await session.abortTransaction()
    } finally {
      session.endSession()
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
        }
        break
      }
      node = await list.findOne({ _id: node.next })
      index++
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
  async findMany(head: Types.ObjectId, start: number, end: number) {
    if (start < 0 || start > end) {
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
      count += node.length
      let recount = count - node.length
      // Start.
      if (start != -1 && count >= start) {
        // If range include in a node,
        if (count >= end) {
          result.value.push(
            ...node.body.slice(start - recount, end - recount)
          )
          result.length = end - start
          break
        }
        // else.
        result.value.push(
          ...node.body.slice(start - recount)
        )
        result.length = start - recount
        result.node.push(node._id)
        start = -1
      }
      // Middle.
      if (start == -1 && end > count) {
        result.value.push(...node.body)
        result.node.push(node._id)
        result.length += node.length
      }
      // End.
      if (count >= end) {
        result.value.push(
          ...node.body.slice(0, end - recount)
        )
        result.length = end - recount
        result.node.push(node._id)
        break
      }

      node = await list.findOne({ _id: node.next })
    }

    return result
  }

  async updateOne() { }
  async appendMany() { }
  async deleteMany() { }
  async query() { }
}