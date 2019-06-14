'use strict';
const Router = require('./router');

module.exports = {
  init: async app => {
    const router = new Router();
    await router.route(app);
  }
};
