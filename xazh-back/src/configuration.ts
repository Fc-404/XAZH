import { Configuration, App, Inject, MidwayDecoratorService } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';

import { Mongod } from './util/mongod.util';

import { GetUserInfo } from './middleware/getUserInfo.middleware';
import { ReportMiddleware } from './middleware/report.middleware';
import { NormalizeResponse } from './middleware/response.middleware';

import { GetBoundaryM } from './decorator/param/formdata.decorator';

import { ForbiddenErrorFilter } from './filter/forbidden.filter';
import { NotFoundErrorFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { ValidateErrorFilter } from './filter/validate.filter';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})

export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  @Inject()
  db: Mongod

  @Inject()
  decoratorService: MidwayDecoratorService

  async onReady() {

    // add middleware
    this.app.useMiddleware([
      require('@koa/cors')(),
      GetUserInfo,
      ReportMiddleware,
      NormalizeResponse,
    ]);

    // add filter
    this.app.useFilter([
      ForbiddenErrorFilter,
      DefaultErrorFilter,
      NotFoundErrorFilter,
      ValidateErrorFilter
    ]);

    // add decorator
    GetBoundaryM(this.decoratorService)
  }
}
