'use strict';
const request = require('supertest');
const apiSetup = require('../api.setup');

module.exports.init = async () => {
  const testConfig = {
    db: ':memory:'
  };
  const app = await apiSetup(testConfig);
  return request(app);
};
