'use strict';
const express = require('express');
const Router = require('./router');

module.exports = async app => {
  const router = new Router();
  await router.route(app);
  app.use(express.static('resources'));
};
