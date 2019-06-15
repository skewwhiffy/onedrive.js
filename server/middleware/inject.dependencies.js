'use strict';
const autobind = require('auto-bind');

module.exports = class {
  constructor(ioc) {
    this.ioc = ioc;
    autobind(this);
  }

  async run(req, _res, next) {
    req.ioc = this.ioc;
    next();
  }
};
