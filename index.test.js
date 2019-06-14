'use strict';
const fs = require('es6-fs');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const { expect } = require('chai');
const Setup = require('./server/test.utils/integration.setup');

chai.use(dirtyChai);

describe('GET /', () => {
  let setup;

  beforeEach(() => { setup = new Setup(); });

  it('serves index.html', async () => {
    const expectedFile = await fs.readFile('resources/index.html');
    const expected = expectedFile.toString();

    const response = await setup.request.get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.equal(expected);
  });
});
