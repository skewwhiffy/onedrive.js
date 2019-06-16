'use strict';
import express from 'express';
import Db from './db';
import Ioc from '../ioc/container';
import Router from './router';
import Middleware from './middleware';

export default async (config, inject) => {
  const app = express();
  const ioc = new Ioc(Object.assign(inject || {}, { app, config }));
  await Middleware.init(ioc);
  await Router.init(app);
  await Db.init(ioc);
  app.use(express.static('resources'));
  return { app, ioc };
};
