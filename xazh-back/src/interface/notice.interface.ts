import { Types } from "mongoose";

export enum NOTICE_ACT_TYPE {
  Read = 0,
  Like,
  Star,
  Share,
  Comment,
}

export enum NOTICE_OBJ_TYPE {
  Blog = 0,
  Comment,
}

export interface INoticeTemplete {
  who: Types.ObjectId | 'System',
  act: NOTICE_ACT_TYPE,
  obj: NOTICE_OBJ_TYPE,
  date: Date,
  msg?: string,
  objId?: any,
}