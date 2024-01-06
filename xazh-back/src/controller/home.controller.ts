import { Controller, Get } from '@midwayjs/core';
import { base64WithDate } from '../util/encodeMsg.util';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello XAZH!';
  }

  @Get('/test')
  async test(): Promise<any> {
    return base64WithDate('111111', new Date('2023-09-19T01:03:54.441Z'))
  }
}
