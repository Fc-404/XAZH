import {
  Body, Controller, Inject,
  Post, UseGuard
} from "@midwayjs/core";
import { Context } from "koa";
import { TokenGuard } from "../guard/token.guard";
import { PConfDTO } from "../dto/pconf.user.dto";
import { UserConfigService } from "../service/config.user.service";

@Controller('/User/Config')
@UseGuard(TokenGuard)
export class UserConfigController {

  @Inject()
  ctx: Context

  @Inject()
  userConfigService: UserConfigService

  /**
   * If the code is 1, return the pconf.
   * If the code is 0, return nothing.
   * If the code is -1, there haven't pconf in server.
   * @param body 
   * @returns 
   */
  @Post('/PConf/Sync')
  async pconfSync(@Body() body: PConfDTO) {
    const configId = this.ctx.user['id']
    const sameVersion = await this.userConfigService.checkPConfVersion(configId, body.version)

    if (sameVersion === false) {
      this.ctx.code = 1
      const pconf = await this.userConfigService.getPConf(configId)
      return pconf
    } else if (sameVersion === true) {
      this.ctx.code = 0
      return '配置文件一致！'
    } else {
      this.ctx.code = -1
      return '服务端无配置！'
    }
  }

  @Post('/PConf/Upload')
  async pconfUpload(@Body() body: PConfDTO) {
    const {
      id, date, token, version,
      ...pconf
    } = body

    const result = await this.userConfigService.setPCong(this.ctx.user['id'], pconf)

    if (result) {
      return '上传成功！'
    } else {
      this.ctx.code = -1
      return '上传失败！'
    }
  }

}