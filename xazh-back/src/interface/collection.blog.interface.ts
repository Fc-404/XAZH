/**
 * Interface about collection.
 */

import { Types } from "mongoose";
import { PRIVACY_TYPE } from "../types/privacy.types";

export interface ICollectionCreate {
  name: string,
  author: Types.ObjectId,
  abstract?: string,
  cover?: string,
  privacy?: PRIVACY_TYPE,
}