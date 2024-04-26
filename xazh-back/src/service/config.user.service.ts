import { Provide } from "@midwayjs/core";
import { Types } from "mongoose";
import UserConfig from '../model/config.user.model'
import UserBase from '../model/base.user.model'
import { md5 } from "../util/crypto.util";

@Provide()
export class UserConfigService {

  /**
   * Check version of pconf.
   * If return is undefined, there is not the pconf in database.
   * @param version 
   * @returns true | false | undefined
   */
  async checkPConfVersion(id: Types.ObjectId, version: string): Promise<boolean | undefined> {
    const config = await UserConfig.model.findById(id)
    if (!config?.pconf) {
      return undefined
    }
    switch (config.pconf['version']) {
      case version:
        return true
      case undefined:
        return undefined
      default:
        return false
    }
  }

  /**
   * get pconf by id.
   * @param id 
   * @returns object
   */
  async getPConf(id: Types.ObjectId): Promise<object> {
    const config = await UserConfig.model.findById(id)

    return config?.pconf || null
  }

  /**
   * set pconf.
   * @param id 
   * @param pconf 
   * @returns boolean
   */
  async setPCong(id: Types.ObjectId, pconf: object): Promise<boolean> {
    const result = await UserConfig.model.findById(id)
    if (!result.pconf)
      result.set('pconf', {})
    const spconf = result?.pconf as any
    for (let i of Object.keys(pconf))
      spconf[i] = pconf[i]
    const { version, date, ...newpconf } = spconf
    spconf['date'] = Date.now()
    spconf['version'] = md5(JSON.stringify(newpconf))
    result.markModified('pconf')
    return (await result.save()) ? true : false
  }

  /**
   * get config id by the user name.
   * @param user 
   * @returns ObjectId
   */
  async getConfigId(userid: Types.ObjectId): Promise<Types.ObjectId> {
    const result = await UserBase.model.findOne({ _id: userid }, ['config_link'])

    return result?.config_link
  }
}