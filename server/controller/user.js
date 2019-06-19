'use strict';

export default class {
  constructor() {
    this.routes = {
      '/': {
        get: this.get,
        put: this.put
      },
      '/code/:code': {
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
    const onedriveService = await req.ioc.getOnedriveService();
    const oauthToken = await onedriveService.getOauthToken(req.params.code);
    res.redirect('/');
  }
}
