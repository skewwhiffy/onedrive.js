'use strict';
const { expect } = require('chai');
const Server = require('../test.utils/integration.setup');

describe('GET /api/ping', () => {
  let server;

  beforeEach(() => {
    server = new Server();
  });

  it('returns message', async () => {
    const result = await server.request.get('/api/ping');

    expect(result.status).to.equal(200);
    expect(result.body.message).to.equal('pong');
  });
});
