'use strict';

module.exports = class {
  constructor() {
    this.routes = {
      '/': {
        get: this.get
      }
    };
  }

  async get(req, res) {
    res.send({
      db: {
        // TODO
        status: 'OK'
      }
    });
  }
};
