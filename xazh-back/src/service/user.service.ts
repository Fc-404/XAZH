import { Provide } from '@midwayjs/core';
import UserBase from '../model/base.user.model';
import FileInfo from '../model/info.file.model'
import { IAddUser } from '../interface/user.interface';
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

      await FileInfo.model.create([{
        fileMd5: options.user
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

  async getUser(options) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

}
