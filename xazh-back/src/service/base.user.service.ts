import { Provide } from '@midwayjs/core';
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
  async haveUser(user: string) {
    return (await UserBase.model.findOne({ user: user }))
      ? true : false
  }

  /**
   * Add User
   * @param options 
   * @returns
   */
  async addUser(options: IAddUser) {
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
  async verifyPswd(account: string, pswd: string, userInfo?: Object) {
    const filter = ['user', 'pswd']

    var result = await UserBase.model.findOne({ user: account }, filter)
    if (!result)
      result = await UserBase.model.findOne({ bind_mail: account }, filter)

    // Whether exist account.
    if (!result)
      return 1

    // confusion password verification.
    const date: number = new Date().getDate()
    if (Md5.hashStr(account + result.pswd + date) == pswd
      || Md5.hashStr(account + result.pswd + (date - 1)) == pswd) {
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
  async existMail(mail: string) {
    return (await UserBase.model.findOne({ bind_mail: mail }))
      ? true : false
  }
}
