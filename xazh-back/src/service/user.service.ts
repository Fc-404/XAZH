import { Inject, Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface/interface';
import { Mongod } from '../util/mongod';
import UserBase from '../model/base.user.model';

@Provide()
export class UserService {

  @Inject()
  db: Mongod

  async addUser() {
    UserBase.model.create({
      name: 'xazh'
    })
  }
  
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
