'use strict';

export default class {
  constructor() {
    this.routes = {
      /*
      folder: {
        get: this.get
      },
      */
      'folder/:folder(*)': {
        get: this.get
      }
    };
    this.baseRoute = 'user/:userId';
  }

  async get(req, res) {
    const fileRepo = await req.ioc.getFileRepo();
    const { userId, folder } = req.params;
    const result = await fileRepo.getFolders({ id: userId }, folder);
    res.send(result);
  }
}
