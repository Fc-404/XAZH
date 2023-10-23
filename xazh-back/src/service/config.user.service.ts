import { Provide } from "@midwayjs/core";
import { ObjectId } from "mongoose";
import UserConfig from '../model/config.user.model'
import UserBase from '../model/base.user.model'
import { Md5 } from "ts-md5";

@Provide()
export class UserConfigService {

  /**
   * Check version of pconf.
   * If return is undefined, there is not the pconf in database.
   * @param version 
   * @returns true | false | undefined
   */
  async checkPConfVersion(id: ObjectId, version: string): Promise<boolean | undefined> {
    const config = await UserConfig.model.findById(id)
    console.log(config.pconf);
    if (!config.pconf) {
      return undefined
    }
    console.log(config.pconf['version']);
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
  async getPConf(id: ObjectId): Promise<object> {
    const config = await UserConfig.model.findById(id)

    return config.pconf
  }

  /**
   * set pconf.
   * @param id 
   * @param pconf 
   * @returns boolean
   */
  async setPCong(id: ObjectId, pconf: object): Promise<boolean> {
    const version = Md5.hashStr(pconf.toString())
    const result = await UserConfig.model.findByIdAndUpdate(
      id, { pconf: { version: version, ...pconf } }
    )
    return result ? true : false
  }

  /**
   * get config id by the user name.
   * @param user 
   * @returns ObjectId
   */
  async getConfigId(user: string): Promise<ObjectId> {
    const result = await UserBase.model.findOne({ user: user }, ['config_link'])

    return result.config_link as ObjectId
  }
}