import { Provide } from "@midwayjs/core"
import UserBase from '../model/base.user.model'


@Provide()
export class UserIdentityService {
  async getUserLevel(user: string): Promise<string> {
    const result = await UserBase.model.findOne(
      { user: user },
      ['level']
    )
    return result.level ?? undefined
  }

  async getUserRanks(user: string): Promise<[string]> {
    const result = await UserBase.model.findOne(
      { user: user },
      ['ranks']
    )
    console.log(result);
    return ['']
  }

  async get(user: string): Promise<
    {
      level: string,
      ranks: [string]
    }
  > {
    const result = await UserBase.model.findOne(
      { user: user },
      ['level', 'ranks']
    )
    console.log(result);
    return { level: '', ranks: [''] }
  }
}