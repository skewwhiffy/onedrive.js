'use strict';
const Ioc = require('../ioc/container');

const ioc = new Ioc();

module.exports = class {
  constructor(config) {
    this.config = config;
  }

  async run(req, _res, next) {
    req.ioc = ioc;
    next();
  }
};
