import {
  Inject,
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuard,
} from '@midwayjs/core'
import { SigninUserDTO, SignupUserDTO, TokenRDTO } from '../dto/signup.user.dto'
import { Context } from '@midwayjs/koa'
import { ObjectId } from 'mongodb'
import { UserService } from '../service/base.user.service'
import { UserTokenService } from '../service/token.user.service'
import { MailService } from '../service/mail.service'
import { base64WithDate, debase64WithDate } from '../util/encodeMsg.util'
import { TokenGuard } from '../guard/token.guard'
import { base64 } from '../util/crypto.util'

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

  /**
   * Whether the user exists.
   * @param username
   * @returns code 0: exist, 1: not exist.
   */
  @Get('/isExist/:username')
  async isExist(@Param('username') username: string) {
    if (await this.userBaseService.haveUser(username)) {
      return true
    } else {
      this.ctx.code = 1
      return false
    }
  }

  /**
   * Add a new user.
   * @param userinfo
   * @returns
   */
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

    const pswd = debase64WithDate({
      date: userinfo.date,
      data: userinfo.pswd,
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
      code: userinfo.code,
    })

    if (result) {
      return '注册成功！'
    } else {
      this.ctx.code = -1
      return '注册失败！'
    }
  }

  /**
   * Sign in.
   * That just judging whether the user exists and password is correct.
   * @param userinfo
   * @returns
   */
  @Post('/Signin')
  async verifyUser(@Body() userinfo: SigninUserDTO) {
    const useri = { _id: undefined, user: '' }
    const result = await this.userBaseService.verifyPswd(
      userinfo.account,
      userinfo.pswd,
      useri
    )

    switch (result) {
      case 0:
        // Token generate algorithm.
        // ! Don't modify it easily.
        const token = base64.encode(
          useri.user + userinfo.pswd + useri.user.length.toString(36)
        )
        const tokenN = base64WithDate(token)

        const result = {
          id: useri._id,
          user: useri.user,
          token: tokenN.data,
          date: tokenN.date,
        }
        await this.userTokenService.setToken(useri._id, token)
        this.userBaseService.pushIp(useri._id, this.ctx.ip)
        return result
      case 1:
        this.ctx.code = 1
        return '账号不存在！'
      case 2:
        this.ctx.code = 2
        return '密码错误！'
    }
  }

  /**
   * Delete the user.
   * @returns
   */
  @Post('/Delete')
  @UseGuard(TokenGuard)
  async deleteUser() {
    const result = await this.userBaseService.deleteUser(
      this.ctx.user['id'],
      this.ctx.user['name']
    )
    if (result) {
      await this.userTokenService.deleteToken(this.ctx.user['id'])
      return '注销成功！'
    } else {
      this.ctx.code = 1
      return '注销失败！'
    }
  }

  /**
   * Get user info.
   * @returns
   */
  @Post('/GetUserInfo')
  @UseGuard([TokenGuard])
  async getUserInfo() {
    const result = await this.userBaseService.getUserInfo(this.ctx.user['id'])
    return result
  }

  /**
   * Get some users info.
   * @param users
   * @returns
   */
  @Post('/UsersInfo')
  async usersInfo(@Body('users') users: string[]) {
    users = typeof users === 'string' ? [users] : users
    const result = {}
    for (let user of users) {
      if (!ObjectId.isValid(user)) continue
      let r = await this.userBaseService.getUserInfo(new ObjectId(user), [
        '_id',
        'himg',
        'user',
        'exp',
        'level',
        'ranks',
        'about_me',
        'signup_date',
        'belong_place',
        'disabled',
        'deleted',
      ])
      if (r['deleted']) {
        result[r['_id']] = { deleted: true }
        continue
      }
      result[r['_id']] = r
    }

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
  async verifyToken(@Body() body: TokenRDTO) {
    const token =
      debase64WithDate({
        date: body.date,
        data: body.token,
      }) || 'invalid'

    const result = await this.userTokenService.verifyToken(
      this.ctx.user['id'],
      token as string
    )

    if (result) {
      this.userBaseService.pushIp(this.ctx.user['id'], this.ctx.user['ipv4'])
      return '验证成功！'
    } else {
      this.ctx.code = 1
      return '验证失败！'
    }
  }
}
