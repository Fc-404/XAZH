import { Provide } from "@midwayjs/core"
import UserBase from '../model/base.user.model'
import { USER_LEVEL } from "../types/userLevel.types"
import { ObjectId } from "mongoose"

@Provide()
export class UserIdentityService {
  async getUserLevel(userid: ObjectId): Promise<number> {
    const result = await UserBase.model.findOne(
      { _id: userid },
      ['level']
    )
    return result.level ?? 0
  }

  async getUserRanks(userid: ObjectId): Promise<Array<string>> {
    const result = await UserBase.model.findOne(
      { _id: userid },
      ['ranks']
    )
    return result.ranks
  }

  async get(userid: ObjectId): Promise<
    {
      level: USER_LEVEL,
      ranks: Array<string>
    }
  > {
    const result = await UserBase.model.findOne(
      { _id: userid },
      ['level', 'ranks']
    )
    return {
      level: result?.level ?? 0,
      ranks: result?.ranks ?? []
    }
  }
}