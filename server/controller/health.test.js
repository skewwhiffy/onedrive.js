'use strict';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('GET /api/health', () => {
  let server;

  beforeEach(async () => {
    ({ server } = await Server.init());
  });

  it('returns health check', async () => {
    const result = await server.get('/api/health');

    expect(result.status).to.equal(200);
    expect(result.body.db.status).to.equal('OK');
  });

  it('returns health check - DUPE', async () => {
    const result = await server.get('/api/health');

    expect(result.status).to.equal(200);
    expect(result.body.db.status).to.equal('OK');
  });
});
