'use strict';
import Server from '../../test.utils/integration.setup';

describe('GET /api/folder/:pathToFolder', () => {
  let server;

  beforeEach(async () => {
    ({ server } = await Server.init());
  });

  it('returns root folders', async () => {
    const result = await server.get('/api/folder/')

    throw Error('TODO');
  });
});
