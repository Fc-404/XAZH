import { Provide } from "@midwayjs/core";
import Log from '../model/log.model'

@Provide()
export class LogService {

  async add() {
    console.time('add')

    const r = await Log.model.findOne({ _id: 'test' })

    for (let i = 0; i < 100; i++) {
      r.msgs.push({
        msg: i.toString(),
        type: 'Default'
      })
    }

    await r.save()

    // for (let i = 0; i < 100; i++) {
    //   await Log.model.updateOne({
    //     _id: 'test',
    //   }, {
    //     $push: {
    //       msgs: {
    //         msg: i.toString(),
    //         type: 'Default'
    //       }
    //     }
    //   }, {
    //     upsert: true
    //   })
    // }

    return console.timeEnd('add')
  }

  async find() {
    console.time('find')

    const r = await Log.model.find({
      msgs: {
        $elemMatch: {
          msg: '100'
        }
      }
    })

    console.log(r);

    return console.timeEnd('find')
  }
}
