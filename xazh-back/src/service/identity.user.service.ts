import { Provide } from "@midwayjs/core"
import UserBase from '../model/base.user.model'


@Provide()
export class UserIdentityService {
  async getUserLevel(user: string): Promise<number> {
    const result = await UserBase.model.findOne(
      { user: user },
      ['level']
    )
    return result.level ?? 0
  }

  async getUserRanks(user: string): Promise<Array<string>> {
    const result = await UserBase.model.findOne(
      { user: user },
      ['ranks']
    )
    return result.ranks
  }

  async get(user: string): Promise<
    {
      level: number,
      ranks: Array<string>
    }
  > {
    const result = await UserBase.model.findOne(
      { user: user },
      ['level', 'ranks']
    )
    return {
      level: result.level ?? 0,
      ranks: result.ranks ?? []
    }
  }
}