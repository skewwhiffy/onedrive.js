'use strict';

module.exports = class {
  constructor(config) {
    this.config = config;
  }

  async run(req, _res, next) {
    req.ioc = {};
    next();
  }
};
