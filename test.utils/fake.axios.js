'use strict';
import axiosist from 'axiosist';
import Server from './integration.setup';

export default {
  init: async () => {
    const { server, app } = await Server.init();
    const axios = axiosist(app);
    return { app, axios, server };
  }
};
