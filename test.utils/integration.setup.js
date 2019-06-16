'use strict';
import request from 'supertest';
import apiSetup from '../server/setup/api';
import Logger from '../server/utils/logger';

export default {
  init: async () => {
    const testConfig = { db: ':memory:' };
    const { app, ioc } = await apiSetup(testConfig, { logger: new Logger(() => {}) });
    const server = request(app);
    return { app, ioc, server };
  }
};
