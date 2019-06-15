'use strict';
const autobind = require('auto-bind');
const Ioc = require('../ioc/container');

module.exports = class {
  constructor(config) {
    this.ioc = Ioc.init(config);
    autobind(this);
  }

  async run(req, _res, next) {
    req.ioc = this.ioc;
    next();
  }
};
