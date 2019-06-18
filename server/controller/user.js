'use strict';

export default class {
  constructor() {
    this.routes = {
      '/': {
        get: this.get,
        put: this.put
      },
      '/code/:id': {
        get: this.code
      }
    };
  }

  async get(req, res) {
    const userRepo = await req.ioc.getUserRepo();
    const users = await userRepo.get();
    res.send(users);
  }

  async put(req, res) {
    const onedriveService = await req.ioc.getOnedriveService();
    const { loginUrl, loginQuery } = onedriveService;
    res.send({
      redirect: loginUrl,
      query: loginQuery
    });
  }

  async code(req, res) {
    if (req.params && req.params.id) {
      const onedriveService = await req.ioc.getOnedriveService();
      onedriveService.insertCode(req.params.id);
      res.redirect('/');
    }
  }
}
