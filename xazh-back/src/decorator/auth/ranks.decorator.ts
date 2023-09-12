/**
 * Identify the ranks
 */

import { savePropertyMetadata } from "@midwayjs/core"

export const USER_KEY = 'decorator:Ranks'

export function Ranks(rankName: string | string[]): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    rankName = [].concat(rankName)
    savePropertyMetadata(USER_KEY, rankName, target, propertyKey)
  }
}