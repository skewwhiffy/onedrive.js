'use strict';
const request = require('supertest');
const apiSetup = require('../setup/api');
const Logger = require('../utils/logger');

module.exports.init = async () => {
  const testConfig = {
    db: ':memory:'
  };
  const app = await apiSetup(testConfig, { logger: new Logger(() => {}) });
  return request(app);
};
