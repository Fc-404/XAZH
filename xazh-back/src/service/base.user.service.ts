import { Context, Inject, Provide, makeHttpRequest } from '@midwayjs/core';
import { IAddUser } from '../interface/user.interface';
import { Types } from 'mongoose';

import UserBase from '../model/base.user.model';
import UserBlogs from '../model/blog.user.model'
import UserConfig from '../model/config.user.model'
import UserMesg from '../model/message.user.model'
import UserRel from '../model/relation.user.model'
import { sha1 } from '../util/crypto.util';

const ipMaxCount = 20

@Provide()
export class UserService {

  @Inject()
  ctx: Context

  /**
   * Determine if the user exists.
   * @param user
   * @returns true | false
   */
  async haveUser(user: string): Promise<boolean> {
    return (await UserBase.model.findOne({ user: user }))
      ? true : false
  }

  /**
   * Add User
   * @param options 
   * @returns true | false
   */
  async addUser(options: IAddUser): Promise<boolean> {
    let result = true
    const session = await UserBase.model.startSession()
    session.startTransaction()

    try {
      if (await this.haveUser(options.user))
        throw null

      const user = await UserBase.model.create([{
        user: options.user,
        pswd: options.pswd,
        bind_mail: options.mail
      }], { session })

      // Personal Blog.
      const blogs = await UserBlogs.model.create([{
        _id: user[0]._id
      }], { session })
      user[0].set('blogs_link', blogs[0]._id)

      // Personal Config.
      const config = await UserConfig.model.create([{
        _id: user[0]._id
      }], { session })
      user[0].set('config_link', config[0]._id)

      // Personal Message.
      const message = await UserMesg.model.create([{
        _id: user[0]._id
      }], { session })
      user[0].set('message_link', message[0]._id)

      // Personal Relation.
      const relation = await UserRel.model.create([{
        _id: user[0]._id
      }], { session })
      user[0].set('relation_link', relation[0]._id)

      // TODO: Other Documents haven't create.

      await user[0].save({ session })
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
   * Delete User
   */
  async deleteUser(id: string, user: string): Promise<boolean> {
    const result = await UserBase.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id)
      },
      {
        $set: {
          deleted: true,
          user: user + '.del.' + Date.now()
        }
      }
    )

    return result ? true : false
  }

  /**
   * Verify password.
   * 0 means validation success
   * 1 means account not exist
   * 2 means validation failed
   * @param account 
   * @param pswd 
   * @returns number
   */
  async verifyPswd(account: string, pswd: string, userInfo?: Object): Promise<number> {
    const filter = ['_id', 'user', 'pswd']

    var result = await UserBase.model.findOne({ user: account }, filter)
    if (!result)
      result = await UserBase.model.findOne({ bind_mail: account }, filter)

    // Whether exist account.
    if (!result)
      return 1

    // Confusion password verification.
    if (sha1(account + result.pswd + account) == pswd) {
      for (let i of filter)
        userInfo[i] = result[i]
      return 0
    }
    return 2
  }

  /**
   * Whether the mail is registered.
   * @param mail 
   * @returns true | false
   */
  async existMail(mail: string): Promise<boolean> {
    return (await UserBase.model.findOne({ bind_mail: mail, deleted: { $ne: true } }))
      ? true : false
  }

  /**
   * Add the signin or verify ip address.
   * And calclate the belong_place.
   * @param user 
   * @param ip 
   */
  async pushIp(userid: Types.ObjectId, ip: string) {
    if (!ip) {
      this.ctx.logger.warn(`The user ${userid} has no ip when signin.`)
      return false
    }

    /**
     const url = `http://ip-api.com/json/${ip}?fields=16409&lang=zh-CN`
     ipInfo?.data['status'] != 'success' ? 'unknow'
        : (ipInfo?.data['country'] ?? 'unknow')
        + ',' + (ipInfo?.data['regionName'] ?? 'unknow')
        + ',' + (ipInfo?.data['city'] ?? 'unknow')
     */
    const url = `https://www.ip.cn/api/index?ip=${ip}&type=1`
    let ipInfo
    await makeHttpRequest(url, {
      headers: {
        'User-Agent': 'XAZH/1.0(http://xazh.cc)',
        'Accept': '*/*',
        'Host': 'www.ip.cn',
        'Connection': 'keep-alive'
      }
    }).then(v => {
      if (v.status == 200)
        ipInfo = JSON.parse(v.data.toString())
      else
        throw 'Status error.'
    }).catch((e) => {
      this.ctx.logger.error('Failed to require information of ip.\n' + e)
    })

    if (ipInfo?.rs != 1) {
      this.ctx.logger.warn(`The user ${userid} has error ip when signin.`)
      return false
    }

    const result = await UserBase.model.findOne({ _id: userid }, ['recent_ip', 'belong_place'])

    result?.recent_ip?.unshift({
      ip: ip,
      place: ipInfo.address.replace(/ +/g, ',').replace(/^,|,$/g, '')
    })
    // Limit the information to 20 pieces.
    for (let i = 0; i < (result?.recent_ip?.length ?? 0) - ipMaxCount; ++i) {
      result.recent_ip.pop()
    }

    // Calclate the belong_place by the recent_ip.
    const places = {}
    const mostPlace = { key: '', count: 0 }
    for (let i of result.recent_ip) {
      if (i.place != 'unknow') {
        let placeCount = places[i.place] ?? 0
        places[i.place] = ++placeCount
        if (placeCount > mostPlace.count) {
          mostPlace.key = i.place
          mostPlace.count = placeCount
        }
      }
    }
    const place = mostPlace.key.split(',')
    result.belong_place =
      place[0] == '中国'
        ? (place[1] ?? place[0])
        : (place[0] ?? result.belong_place)

    result.save()
  }

  /**
   * Get User Info.
   * @param user 
   * @returns UserInfo
   */
  async getUserInfo(userid: Types.ObjectId, options = null): Promise<object> {
    return await UserBase.model.findOne(
      { _id: userid },
      options ?? { pswd: 0 }
    )
  }
}
