import { Controller, Get, Inject } from '@midwayjs/core';
import { ListUtilService } from '../service/list.util.service';
import { Types } from 'mongoose';
import { LogService } from '../service/log.service';

@Controller('/')
export class HomeController {
  @Inject()
  l: ListUtilService
  @Inject()
  log: LogService

  @Get('/')
  async home(): Promise<string> {
    return 'Hello XAZH!';
  }

  @Get('/test')
  async test(): Promise<any> {
    let result
    // for (let i = 0; i < 10; i++)
    //   await this.log.red('error, user is bad.')

    result = await this.log.get('20240305')

    // result = await this.l.createList()
    // console.log(result);

    // const headid = new Types.ObjectId('65e5798d5d8cf1a04749c7e4')

    // for (let i = 0; i < 1000; i++) {
    //   await this.l.appendOne(headid, i.toString())
    // }

    // for (let i = 0; i < 48; i++)
    //   await this.l.insertOne(headid, '12345', 150)

    // result = await this.l.findMany(headid, 0, 500)

    // for (let i = 0; i < 50; i++)
    //   result = await this.l.deleteOne(headid, 651 + i)

    // result = await this.l.deleteList(headid)

    return result
  }
}
