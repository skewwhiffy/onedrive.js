'use strict';
const express = require('express');
const Router = require('./router');

module.exports = async () => {
  const app = express();
  const router = new Router();
  await router.route(app);
  app.use(express.static('resources'));
  return app;
};
