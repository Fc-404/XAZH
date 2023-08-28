import {
  Inject, Controller, Post,
  Body, Param, Get
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { SignupUserDTO } from '../dto/signup.user.dto';
import { MailService } from '../service/mail.service';

@Controller('/User')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  mailService: MailService

  @Get('/isExist/:username')
  async isExist(@Param('username') username: string) {
    if (await this.userService.haveUser(username)) {
      return true
    } else {
      this.ctx.code = 1
      return false
    }
  }

  @Post('/Signup')
  async addUser(@Body() userinfo: SignupUserDTO) {

    if (await this.userService.existMail(userinfo.mail)) {
      this.ctx.code = 2
      return '邮箱已被注册！'
    }

    if (!(await this.mailService.verifyCode(userinfo.mail, userinfo.code))) {
      this.ctx.code = 1
      return '验证码错误！'
    }

    const result = await this.userService.addUser({
      user: userinfo.user,
      pswd: userinfo.pswd,
      mail: userinfo.mail,
      code: userinfo.code
    })

    if (result) {
      return '注册成功！'
    } else {
      this.ctx.code = -1
      return '注册失败！'
    }
  }
}
