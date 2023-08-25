/**
 * Valid EMail.
 */

import { Context } from "@midwayjs/koa";
import { Body, Controller, Inject, Post } from "@midwayjs/core";
import { MailDTO, ValidMailDTO } from "../dto/validMail.dto";
import { sendMailByOutlook } from "../util/sendMail.util";
import { MailService } from "../service/mail.service";
import SignupCodeTemplete from "../templete/SignupCode.templete";

@Controller('/')
export class ValidMailController {

  @Inject()
  ctx: Context

  @Inject()
  mailser: MailService

  /**
   * Send mail valid code.
   * @param vmdto 
   * @returns true | false
   */
  @Post('/SendMailValidCode')
  async validEMail(@Body() vmdto: MailDTO) {

    const code = Math.random().toString().slice(2, 8)
    let result: any = await sendMailByOutlook(vmdto.mail,
      'XAZH-注册验证',
      SignupCodeTemplete(code))

    if (result) {
      await this.mailser.saveValidCode(vmdto.mail, code)
      return true
    } else {
      this.ctx.status = 500
      return false
    }

  }

  /**
   * Verify the code that we sent.
   * @param vmdto 
   * @returns true | false
   */
  @Post('/VerifyMailCode')
  async verifyMailCode(@Body() vmdto: ValidMailDTO) {
    return await this.mailser.verifyCode(vmdto.mail, vmdto.code)
  }

}