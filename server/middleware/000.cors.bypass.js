'use strict';

export default class {
  async run(_req, res, next) {
    // TODO: Only allow this for dev
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Tye, Accept');
    next();
  }
}
