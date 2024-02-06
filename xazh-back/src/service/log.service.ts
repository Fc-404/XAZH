import { Provide } from "@midwayjs/core";
import Log from '../model/log.model'


@Provide()
export class LogService {

  async add() {
    console.time('add')

    // const r = await Log.model.findOne({ _id: 'test' })

    // for (let i = 0; i < 100; i++) {
    //   r.msgs.push({
    //     msg: i.toString(),
    //     type: 'Default'
    //   })
    // }

    // await r.save()

    for (let i = 0; i < 1000000; i++) {
      console.time(i.toString())
      // await Log.model.updateOne({
      //   _id: 'test',
      // }, {
      //   $push: {
      //     msgs: {
      //       msg: i.toString(),
      //       type: 'Default'
      //     }
      //   }
      // }, {
      //   upsert: true
      // })
      await Log.model.create({
        // _id: Md5.hashStr()
      })
      console.timeEnd(i.toString())
    }

    return console.timeEnd('add')
  }

  async find(str: string) {

    const r = await Log.model.findOne({
      'msgs.msg': str
    }, { 'msgs.$': 1 }
    )

    return r
  }
}
