'use strict';
import Ioc from '../ioc/container';

export default class {
  async run(req, _res, next) {
    req.ioc = new Ioc(req);
    next();
  }
}
