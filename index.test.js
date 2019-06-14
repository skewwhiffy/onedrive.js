'use strict';
const fs = require('es6-fs');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = require('chai');
const Server = require('./server/test.utils/integration.setup');

chai.use(dirtyChai);

describe('GET /', () => {
  let server;

  beforeEach(async () => { server = await Server.init(); });

  it('serves index.html', async () => {
    const expectedFile = await fs.readFile('resources/index.html');
    const expected = expectedFile.toString();

    const response = await server.get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.equal(expected);
  });
});
