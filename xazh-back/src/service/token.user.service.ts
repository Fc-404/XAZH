import { Provide } from "@midwayjs/core";
import UToken from '../model/token.user.model'

@Provide()
export class UserToken {

  /**
   * Set User's Token.
   * @param user 
   * @param token 
   * @returns true | false
   */
  async setToken(user: string, token: string) {
    const result = await UToken.model.findOneAndUpdate({
      _id: user
    }, {
      token: token
    }, {
      upsert: true
    })

    return result ? true : false
  }

  async verifyToken(user: string, token: string) {
    const result = await UToken.model.findOne({
      _id: user,
      token: token,
    })

    return result ? true : false
  }
}