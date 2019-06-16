'use strict';
import axiosist from 'axiosist';
import Server from './integration.setup';

export default {
  init: async () => {
    const { app, ioc, server } = await Server.init();
    const axios = axiosist(app);
    return {
      app,
      axios,
      ioc,
      server
    };
  }
};
