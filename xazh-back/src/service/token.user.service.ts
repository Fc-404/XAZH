import { Provide } from "@midwayjs/core";
import UToken from '../model/token.user.model'

@Provide()
export class UserToken {

  async setToken(user: string, token: string) {
    UToken.model.findOneAndUpdate({
      user: user
    }, {
      token: token
    }, {
      upsert: true
    })
  }

  async verifyToken(user: string, token: string) {

  }
}