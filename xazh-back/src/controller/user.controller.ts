import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { SignupUserDTO } from '../dto/signup.user.dto';
import { MailService } from '../service/mail.service';

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  mailService: MailService


  @Post('/signup')
  async addUser(@Body() userinfo: SignupUserDTO) {

    if (!(await this.mailService.verifyCode(userinfo.mail, userinfo.code))) {
      this.ctx.code = 1
      return '验证码错误！'
    }

    this.userService.addUser({
      user: userinfo.user,
      pswd: userinfo.pswd,
      mail: userinfo.mail,
      code: userinfo.code
    })

    // return 0
  }
}
