'use strict';
import request from 'supertest';
import apiSetup from '../server/setup/api';
import Logger from '../server/utils/logger';

export default {
  init: async inject => {
    const testConfig = { db: ':memory:' };
    const defaultInjected = {
      logger: new Logger(() => {})
    };
    if (inject) Object.assign(defaultInjected, inject);
    const { app, ioc } = await apiSetup(testConfig, defaultInjected);
    const server = request(app);
    return { app, ioc, server };
  }
};
