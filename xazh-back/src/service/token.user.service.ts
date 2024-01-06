import { Provide } from "@midwayjs/core";
import UToken from '../model/token.user.model'
import { ObjectId } from "mongoose";

@Provide()
export class UserTokenService {

  /**
   * Set User's Token.
   * @param userid
   * @param token 
   * @returns true | false
   */
  async setToken(userid: ObjectId, token: string): Promise<boolean> {
    const result = await UToken.model.findOneAndUpdate({
      _id: userid
    }, {
      token: token,
      date: Date.now()
    }, {
      upsert: true
    })

    return result ? true : false
  }

  /**
   * Verify user's token.
   * @param userid
   * @param token 
   * @returns true | false
   */
  async verifyToken(userid: ObjectId, token: string): Promise<boolean> {
    const result = await UToken.model.findOne({
      _id: userid,
      token: token,
    })

    return result ? true : false
  }

  /**
   * Delete user's token.
   * @param userid
   * @returns true | false
   */
  async deleteToken(userid: ObjectId): Promise<boolean> {
    const result = await UToken.model.deleteOne({
      _id: userid
    })

    return result ? true : false
  }
}