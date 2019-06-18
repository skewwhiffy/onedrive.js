'use strict';
import express from 'express';
import Db from './db';
import Ioc, { init } from '../ioc/container';
import Router from './router';
import Middleware from './middleware';
import Logger from '../utils/logger';

export default async (config, inject) => {
  const defaultDeps = {
    app: express(),
    config,
    logger: new Logger()
  };
  const toInject = Object.assign(defaultDeps, inject);
  init(toInject);
  const ioc = new Ioc();
  const app = await ioc.getApp();
  await Middleware.init(ioc);
  await Router.init(ioc);
  await Db.init(ioc);
  return { app, ioc };
};
