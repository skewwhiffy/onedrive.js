'use strict';
const express = require('express');
const Router = require('./router');
const Middleware = require('./middleware');

module.exports = async config => {
  const app = express();
  await Router.init(app);
  await Middleware.init(app, config);
  app.use(express.static('resources'));
  return app;
};
