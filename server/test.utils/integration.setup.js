'use strict';
const express = require('express');
const request = require('supertest');
const apiSetup = require('../api.setup');

module.exports = class {
  constructor() {
    const app = express();
    apiSetup(app);
    this.app = app;
  }

  get request() { return request(this.app); }
};
