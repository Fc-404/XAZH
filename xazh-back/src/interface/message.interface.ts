import { Types } from "mongoose";

export enum MessageType {
  Text = 0,
  File,
}

export interface IMessageBody {
  uid: Types.ObjectId | 'System',
  content: string,
  quote?: number,
  type?: number
}