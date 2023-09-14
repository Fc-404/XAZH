import {
  Inject, Controller, Post,
  Body, Param, Get
} from '@midwayjs/core';
import {
  SigninUserDTO, SignupUserDTO,
  TokenDTO
} from '../dto/signup.user.dto';
import { Base64 } from 'js-base64';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/base.user.service';
import { UserToken } from '../service/token.user.service';
import { MailService } from '../service/mail.service';
import { base64WithDate, debase64WithDate } from '../util/encodeMsg.util';

@Controller('/User')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userBaseService: UserService;
  @Inject()
  userTokenService: UserToken

  @Inject()
  mailService: MailService

  @Get('/isExist/:username')
  async isExist(@Param('username') username: string) {
    if (await this.userBaseService.haveUser(username)) {
      return true
    } else {
      this.ctx.code = 1
      return false
    }
  }

  @Post('/Signup')
  async addUser(@Body() userinfo: SignupUserDTO) {

    if (await this.userBaseService.existMail(userinfo.mail)) {
      this.ctx.code = 2
      return '邮箱已被注册！'
    }

    if (!(await this.mailService.verifyCode(userinfo.mail, userinfo.code))) {
      this.ctx.code = 1
      return '验证码错误！'
    }

    const result = await this.userBaseService.addUser({
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

  @Post('/Signin')
  async verifyUser(@Body() userinfo: SigninUserDTO) {
    const useri = { user: '' }

    const result = await this.userBaseService.verifyPswd(userinfo.account, userinfo.pswd, useri)

    switch (result) {
      case 0:
        // Token generate algorithm.
        // ! Don't modify it easily.
        const token = Base64.encode(useri.user + userinfo.pswd + useri.user.length.toString(36))
        const tokenN = base64WithDate(token)

        const result = {
          user: useri.user,
          token: tokenN.data,
          date: tokenN.date,
        }
        await this.userTokenService.setToken(useri.user, token)
        return result
      case 1:
        this.ctx.code = 1
        return '账号不存在！'
      case 2:
        this.ctx.code = 2
        return '密码错误！'
    }
  }

  @Post('/VerifyToken')
  async verifyToken(@Body() body: TokenDTO) {
    const dateC = new Date(body.date).getTime()
    const dateS = new Date().getTime()
    if (dateS - dateC > 30000) {
      this.ctx.code = 999
      return '请求超时！'
    }

    const token = debase64WithDate({
      date: body.date,
      data: body.token
    }) || 'invalid'

    const result =
      await this.userTokenService.verifyToken(body.user, token as string)

    if (result) {
      return '验证成功！'
    } else {
      this.ctx.code = 1
      return '验证失败！'
    }
  }
}
