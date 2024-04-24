import {
  Body,
  Controller, Inject, Param,
  Post, UseGuard
} from "@midwayjs/core";
import { PanelConfigurationDTO, PanelSetConfigurationDTO } from "../dto/panel.dto";
import { PanelService, PANEL_TYPE } from "../service/panel.service";
import { Context } from "@midwayjs/koa";
import { MidwayValidationError } from "@midwayjs/validate";
import { TokenGuard } from "../guard/token.guard";
import { CLevel, Level } from "../decorator/auth/level.decorator";
import { USER_LEVEL } from "../types/userLevel.types";
import { LevelGuard } from "../guard/level.guard";


@Controller('/Panel')
@CLevel(USER_LEVEL.admin)
@UseGuard([TokenGuard, LevelGuard])
export class WEBPanelController {

  @Inject()
  ctx: Context

  @Inject()
  panel: PanelService

  /**
   * Get Configuration.
   * @param options 
   * @param type 
   * @returns config value or error.
   */
  @Post('/Get/:type')
  @Level(USER_LEVEL.user)
  async getConfiguration(
    @Body() options: PanelConfigurationDTO,
    @Param('type') type: PANEL_TYPE
  ) {
    if (!type) {
      throw new MidwayValidationError('No type.', 422, null)
    }
    const group = options.group || undefined
    const name = options.name

    const result = await this.panel.getConfig(type, name, group)
    if (!result) {
      this.ctx.code = 1
      this.ctx.message = 'No such config.'
    }
    return result ? result : false
  }

  /**
   * Set Configuration.
   * @param options 
   * @param type 
   * @returns true if success, false if fail.
   */
  @Post('/Set/:type')
  async setConfiguration(
    @Body() options: PanelSetConfigurationDTO,
    @Param('type') type: PANEL_TYPE
  ) {
    if (!type) {
      throw new MidwayValidationError('No type.', 422, null)
    }
    const group = options.group || undefined
    const name = options.name
    const value = options.value

    console.log(name, value, group);

    const result = await this.panel.setConfig(type, name, value, group)

    if (!result) this.ctx.code = 1
    return result ? value : false
  }

  /**
   * Delete a Configuration.
   * @param options 
   * @param type 
   * @returns 
   */
  @Post('/Delete/:type')
  async deleteConfiguration(
    @Body() options: PanelConfigurationDTO,
    @Param('type') type: PANEL_TYPE
  ) {
    if (!type) {
      throw new MidwayValidationError('No type.', 422, null)
    }
    const group = options.group || undefined
    const name = options.name

    let result = await this.panel.deleteConfig(type, name, group)

    if (!result) this.ctx.code = 1
    return result ? true : false
  }

  /**
   * Get All Configuration.
   * @param options 
   * @param type 
   * @returns config value or error.
   */
  @Post('/GetAll/:type')
  async getAllConfiguration(@Param('type') type: PANEL_TYPE) {
    if (!type) {
      throw new MidwayValidationError('No type.', 422, null)
    }

    const result = await this.panel.getAllConfig(type)

    if (!result) this.ctx.code = 1
    return result ? result : false
  }
}