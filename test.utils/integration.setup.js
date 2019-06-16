'use strict';
import request from 'supertest';
import apiSetup from '../server/setup/api';
import Logger from '../server/utils/logger';

export default {
  init: async () => {
    const testConfig = {
      db: ':memory:'
    };
    const app = await apiSetup(testConfig, { logger: new Logger(() => {}) });
    return request(app);
  }
};
