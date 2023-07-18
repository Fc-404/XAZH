import { Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface/interface';
import { ISignUpUserOptions } from '../interface/signup.user.interface';
import UserBase from '../model/base.user.model';

@Provide()
export class UserService {

  async addUser(options: ISignUpUserOptions) {
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
