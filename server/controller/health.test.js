'use strict';
const { expect } = require('chai');
const Server = require('../test.utils/integration.setup');

describe('GET /api/health', () => {
  let server;

  beforeEach(async () => { server = await Server.init(); });

  it('returns heath check', async () => {
    const result = await server.get('/api/health');

    expect(result.status).to.equal(200);
    expect(result.body.db.status).to.equal('OK');
  });
});
