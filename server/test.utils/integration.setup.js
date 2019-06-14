'use strict';
const request = require('supertest');
const apiSetup = require('../api.setup');

module.exports.init = async () => {
  const app = await apiSetup();
  return request(app);
};
