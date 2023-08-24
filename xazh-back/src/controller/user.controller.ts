import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { SignupUserDTO } from '../dto/signup.user.dto';

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;


  @Post('/signup')
  async addUser(@Body() userinfo) {

    console.log(userinfo);

    // return 0
  }
}
