import { Controller, Get, Inject } from '@midwayjs/core';
import { ListUtilService } from '../service/list.util.service';
import { LogService } from '../service/log.service';
import {Types} from "mongoose";
import UserBlogInteraction from "../model/interaction.blog.user.model";

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
    // this.log.red('test', new Error('error'))
    // for (let i = 0; i < 200; i++)
    //   await this.log.red('error, user is bad.' + i)

    // result = await this.log.get('20240308')

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

    // result = await this.l.deleteOne(headid, (v)=>v == '650', new Types.ObjectId('65e579955d8cf1a04749d5a1'))
    // result = await this.l.insertOne(headid, 1, 5)

    // await UserBlogInteraction.model.create({
    //   _id: '123abc',
    //   islike: true,
    //   isstar: true,
    // })
    // const ubi = await UserBlogInteraction.model.findById('123abc')
    // ubi.comment.set('123', {islike: true})
    // const test = new Map()

    // ubi.save()

    return result
  }
}
