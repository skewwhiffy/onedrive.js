'use strict';

export default class {
  constructor() {
    this.routes = {
      status: {
        get: this.get
      }
    };
    this.baseRoute = 'user/:userId';
  }

  async get(req, res) {
    const syncStatusRepo = await req.ioc.getSyncStatusRepo();
    const { userId } = req.params;
    const { status } = await syncStatusRepo.get({ id: userId });
    res.send({ status });
  }
}
