'use strict';
import Server from './integration.setup';

class FakeAxios {
  constructor(server) {
    this.server = server;
  }

  async get(url) {
    const response = await this.server.get(url);
    return {
      status: response.status,
      headers: response.headers,
      data: response.body
    };
  }
}

export default {
  init: async () => {
    const server = await Server.init();
    const axios = new FakeAxios(server);
    return { axios, server };
  }
};
