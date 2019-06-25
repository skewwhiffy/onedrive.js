'use strict';

export default class {
  constructor() {
    this.routes = {
      'folder/:folder(*)': {
        get: this.get
      }
    };
    this.baseRoute = 'user/:userId';
  }

  async get(req, res) {
    const fileRepo = await req.ioc.getFileRepo();
    const { userId, folder } = req.params;
    const [folders, files] = await Promise.all([
      fileRepo.getFolders({ id: userId }, folder),
      fileRepo.getFiles({ id: userId }, folder)
    ]);
    const result = { folders, files };
    res.send(result);
  }
}
