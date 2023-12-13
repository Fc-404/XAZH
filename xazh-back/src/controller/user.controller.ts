import {
  Inject, Controller, Post,
  Body, Param, Get, UseGuard,
} from '@midwayjs/core';
import {
  SigninUserDTO, SignupUserDTO,
  TokenDTO
} from '../dto/signup.user.dto';
import { Base64 } from 'js-base64';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/base.user.service';
import { UserTokenService } from '../service/token.user.service';
import { MailService } from '../service/mail.service';
import { base64WithDate, debase64WithDate } from '../util/encodeMsg.util';
import { USER_LEVEL } from '../types/userLevel.types';
import { Level } from '../decorator/auth/level.decorator';
import { LevelGuard } from '../guard/level.guard';
import { TokenGuard } from '../guard/token.guard';

@Controller('/User')
export class UserController {
  @Inject()
  ctx: Context

  @Inject()
  userBaseService: UserService
  @Inject()
  userTokenService: UserTokenService

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

    // if (await this.userBaseService.existMail(userinfo.mail)) {
    //   this.ctx.code = 2
    //   return '邮箱已被注册！'
    // }

    if (!(await this.mailService.verifyCode(userinfo.mail, userinfo.code))) {
      this.ctx.code = 1
      return '验证码错误！'
    }

    const pswd = debase64WithDate({
      date: userinfo.date,
      data: userinfo.pswd
    })

    if (!pswd) {
      this.ctx.status = 500
      this.ctx.code = 2
      return '服务器错误！'
    }

    const result = await this.userBaseService.addUser({
      user: userinfo.user,
      pswd: pswd as string,
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
        this.userBaseService.pushIp(
          useri.user,
          this.ctx.user['ipv4']
        )
        return result
      case 1:
        this.ctx.code = 1
        return '账号不存在！'
      case 2:
        this.ctx.code = 2
        return '密码错误！'
    }
  }

  @Post('/GetUserInfo')
  @Level(USER_LEVEL.user)
  @UseGuard([LevelGuard, TokenGuard])
  async getUserInfo() {
    const result = await this.userBaseService.getUserInfo(this.ctx.user.name)
    return result
  }

  /**
   * Necessary steps for automatic login.
   * It will push ip into base info of user.
   * And then request belong-place.
   * @param body
   * @returns 
   */
  @Post('/VerifyToken')
  async verifyToken(@Body() body: TokenDTO) {
    const haveUser = await this.userBaseService.haveUser(body.user)
    if (!haveUser) {
      this.ctx.code = 3
      return '验证失败！'
    }

    const token = debase64WithDate({
      date: body.date,
      data: body.token
    }) || 'invalid'

    const result =
      await this.userTokenService.verifyToken(body.user, token as string)

    if (result) {
      this.userBaseService.pushIp(
        this.ctx.user['name'],
        this.ctx.user['ipv4']
      )
      return '验证成功！'
    } else {
      this.ctx.code = 1
      return '验证失败！'
    }
  }
}
