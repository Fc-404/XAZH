import { MidwayDecoratorService, createCustomParamDecorator } from "@midwayjs/core";

/**
 * Resolve Content Type with in multipart/form-data
 */
export const USER_KEY = 'decorator:FormData'

export function GetBoundary(): ParameterDecorator {
  return createCustomParamDecorator(USER_KEY, {})
}

export function GetBoundaryM(mds: MidwayDecoratorService) {
  mds.registerParameterHandler(USER_KEY, (options) => {
    let ctx = options.originArgs[0]
    let ct = ctx.get('Content-Type')
    let params: Array<string> = ct.split('; ')
    if (params[0] == 'multipart/form-data') {
      let boundarys = params[1].split('=')
      return '--' + boundarys[1]
    } else {
      return null
    }
  })
}