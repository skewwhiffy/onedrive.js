'use strict';
import { promises as fs } from 'fs';
import shortId from 'shortid';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Server from './test.utils/integration.setup';

const { expect } = chai;

chai.use(dirtyChai);

describe('GET /', () => {
  let server;

  beforeEach(async () => {
    ({ server } = await Server.init());
  });

  it('serves index.html', async () => {
    const expectedFile = await fs.readFile('resources/index.html');
    const expected = expectedFile.toString();

    const response = await server.get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.equal(expected);
  });

  it('redirects root when code query variable exists', async () => {
    const code = shortId();
    const response = await server.get(`/?code=${code}`);

    expect(response.status).to.equal(302);
    expect(response.headers.location).to.equal(`/api/user/code/${code}`);
  });
});
