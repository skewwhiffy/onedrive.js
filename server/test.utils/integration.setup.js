'use strict';
const express = require('express');
const request = require('supertest');
const Init = require('../init');

module.exports = class {
  constructor() {
    const app = express();
    Init.init(app);
    this.app = app;
  }

  get request() { return request(this.app); }
};
