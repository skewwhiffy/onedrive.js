'use strict';
import autobind from 'auto-bind';

export default class {
  constructor(ioc) {
    this.ioc = ioc;
    autobind(this);
  }

  async run(req, _res, next) {
    req.ioc = this.ioc;
    next();
  }
}
