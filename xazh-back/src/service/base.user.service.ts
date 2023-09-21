import { Provide, makeHttpRequest } from '@midwayjs/core';
import UserBase from '../model/base.user.model';
import { IAddUser } from '../interface/user.interface';
import { Md5 } from 'ts-md5';

@Provide()
export class UserService {

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

      await UserBase.model.create([{
        user: options.user,
        pswd: options.pswd,
        bind_mail: options.mail
      }], { session })

      // TODO: Other Documents haven't create.

      await session.commitTransaction()
    } catch {
      await session.abortTransaction()
      result = false
    } finally {
      session.endSession()
    }

    return result
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
    const filter = ['user', 'pswd']

    var result = await UserBase.model.findOne({ user: account }, filter)
    if (!result)
      result = await UserBase.model.findOne({ bind_mail: account }, filter)

    // Whether exist account.
    if (!result)
      return 1

    // Confusion password verification.
    if (Md5.hashStr(account + result.pswd + account) == pswd) {
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
    return (await UserBase.model.findOne({ bind_mail: mail }))
      ? true : false
  }

  /**
   * Add the signin or verify ip address.
   * And calclate the belong_place.
   * @param user 
   * @param ip 
   */
  async pushIp(user: string, ip: string) {
    const ipMaxCount = 20

    const url = `http://ip-api.com/json/${ip}?fields=16409&lang=zh-CN`
    const ipInfo = await makeHttpRequest(url, { dataType: 'json' })
    const result = await UserBase.model.findOne({ user: user }, ['recent_ip', 'belong_place'])

    result?.recent_ip?.unshift({
      ip: ip,
      place: ipInfo.data['status'] != 'success' ? 'unknow'
        : (ipInfo.data['country'] ?? 'unknow')
        + ',' + (ipInfo.data['regionName'] ?? 'unknow')
        + ',' + (ipInfo.data['city'] ?? 'unknow')
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
  async getUserInfo(user: string): Promise<object> {
    const userinfo = await UserBase.model.findOne(
      { user: user },
      [
        'info', 'himg', 'user', 'belong_place',
        'exp', 'level', 'ranks', 'signup_time',
        'bind_qq', 'bind_we', 'bind_phone', "bind_mail",
      ]
    )

    return userinfo
  }
}
