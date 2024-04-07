import {Types} from "mongoose";
import {PRIVACY_TYPE} from "../types/privacy.types";

export interface IBlogInfo {
  title: string,
  author: Types.ObjectId,
  privacy: PRIVACY_TYPE,
  body: string,
  abstract?: string,
  keywords?: string[],
  wordcloud?: object,
}
