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
    const userRepo = await req.ioc.getUserRepo();
    const users = await userRepo.get();
    res.send(users);
  }
}
