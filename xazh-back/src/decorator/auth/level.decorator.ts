/**
 * Identify the level
 */

import { savePropertyMetadata } from "@midwayjs/core"
import { USER_LEVEL } from "../../types/userLevel.types"

export const USER_KEY = 'decorator:Level'

export function Level(level: USER_LEVEL): MethodDecorator {
  return (target, propertyKey) => {
    savePropertyMetadata(USER_KEY, level, target, propertyKey)
  }
}