import { Controller, Get, Inject } from '@midwayjs/core';
import { LogService } from '../service/log.service';
import { md5, sha1 } from '../util/crypto.util';

@Controller('/')
export class HomeController {
  @Inject()
  ts: LogService

  @Get('/')
  async home(): Promise<string> {
    return 'Hello XAZH!';
  }

  @Get('/test')
  async test(): Promise<any> {
    // const str = (~~(Math.random() * 70000)).toString()
    // return await this.ts.add()

    console.time('md5')
    const a = md5('12asdf34567890123456agrw7890123sdagf4567890')
    console.timeEnd('md5')
    console.time('sha')
    const b = sha1('12asdf34567890123456agrw7890123sdagf4567890')
    console.timeEnd('sha')

    return [a, b]
  }
}
