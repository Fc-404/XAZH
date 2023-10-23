import {
  Body, Controller, Inject,
  Post, UseGuard
} from "@midwayjs/core";
import { Context } from "koa";
import { CLevel } from "../decorator/auth/level.decorator";
import { USER_LEVEL } from "../types/userLevel.types";
import { TokenGuard } from "../guard/token.guard";
import { LevelGuard } from "../guard/level.guard";
import { PConfDTO } from "../dto/pconf.user.dto";
import { UserConfigService } from "../service/config.user.service";

@Controller('/User/Config')
@CLevel(USER_LEVEL.visitor)
@UseGuard([LevelGuard, TokenGuard])
export class UserConfigController {

  @Inject()
  ctx: Context

  @Inject()
  userConfigService: UserConfigService

  @Post('/PConf/Sync')
  async pconfSync(@Body() body: PConfDTO) {
    const configId = await this.userConfigService.getConfigId(body.user)
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
    const configId = await this.userConfigService.getConfigId(body.user)

    const {
      token, date, user, version,
      ...pconf
    } = body

    const result = await this.userConfigService.setPCong(configId, pconf)

    if (result) {
      return '上传成功！'
    } else {
      this.ctx.code = -1
      return '上传失败！'
    }
  }

}