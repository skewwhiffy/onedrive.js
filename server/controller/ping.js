'use strict';

export default class {
  constructor() {
    this.routes = {
      '/': {
        get: this.get
      }
    };
  }

  async get(req, res) {
    res.send({ message: 'pong' });
  }
}
