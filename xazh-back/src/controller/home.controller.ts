import { Controller, Get, Inject } from '@midwayjs/core';
import { LogService } from '../service/log.service';

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
    return await this.ts.find()
  }
}
