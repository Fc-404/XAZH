import {
  Body, Controller, Post,
  UseGuard
} from "@midwayjs/core";
import { CLevel } from "../decorator/auth/level.decorator";
import { USER_LEVEL } from "../types/userLevel.types";
import { TokenGuard } from "../guard/token.guard";
import { LevelGuard } from "../guard/level.guard";
import { PConfDTO } from "../dto/pconf.user.dto";

@Controller('/User/Config')
@CLevel(USER_LEVEL.visitor)
@UseGuard([LevelGuard, TokenGuard])
export class UserConfigController {

  @Post('/PConf/Sync')
  async sync(@Body() body: PConfDTO) {
    console.log(body);
  }

}