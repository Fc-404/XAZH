/**
 * Identify the level
 */

import {
  saveClassMetadata,
  savePropertyMetadata
} from "@midwayjs/core"
import { USER_LEVEL } from "../../types/userLevel.types"

export const USER_KEY = 'decorator:Level'
export const C_USER_KEY = 'decorator:CLevel'

export function Level(level: USER_LEVEL): MethodDecorator {
  return (target, propertyKey) => {
    savePropertyMetadata(USER_KEY, level, target, propertyKey)
  }
}

export function CLevel(level: USER_LEVEL): ClassDecorator {
  return (target) => {
    saveClassMetadata(C_USER_KEY, level, target)
  }
}