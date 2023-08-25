import { Provide } from '@midwayjs/core';
import UserBase from '../model/base.user.model';
import DataFile from '../model/data.file.model';

@Provide()
export class UserService {

  async addUser(options) {
    UserBase.model.create({
      name: 'xazh'
    })

    DataFile.model.create({
      _id: '1234',
      data: '1234'
    })
  }

  async getUser(options) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
