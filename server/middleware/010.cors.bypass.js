'use strict';
import autobind from 'auto-bind';

export default class {
  constructor() {
    autobind(this);
  }

  async run(req, res, next) {
    if (process.env.NODE_ENV === 'dev') {
      if (!this.logged) {
        this.logged = true;
        const logger = await req.ioc.getLogger();
        logger.warn('Dev environment: bypassing CORS');
      }
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    next();
  }
}
