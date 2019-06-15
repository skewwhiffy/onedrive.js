'use strict';
const express = require('express');
const Router = require('./router');
const Middleware = require('./middleware');

module.exports = async config => {
  const app = express();
  await Middleware.init(app, config);
  await Router.init(app);
  app.use(express.static('resources'));
  return app;
};
