'use strict';
const express = require('express');
const Db = require('./db');
const Ioc = require('../ioc/container');
const Router = require('./router');
const Middleware = require('./middleware');

module.exports = async config => {
  const app = express();
  const ioc = Ioc.init({ app, config });
  await Middleware.init(ioc);
  await Router.init(app);
  await Db.init(config);
  app.use(express.static('resources'));
  return app;
};
