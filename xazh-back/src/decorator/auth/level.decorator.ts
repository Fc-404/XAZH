/**
 * Identify the level
 */

import { savePropertyMetadata } from "@midwayjs/core"

export const USER_KEY = 'decorator:Level'

export function Level(level: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    savePropertyMetadata(USER_KEY, level, target, propertyKey)
  }
}