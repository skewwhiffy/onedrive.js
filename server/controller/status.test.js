'use strict';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('GET /api/user/<userId>/status', () => {
  let ioc;
  let syncStatusRepo;
  let server;
  let user;

  beforeEach(async () => {
    ({ ioc, server } = await Server.init());
    syncStatusRepo = await ioc.getSyncStatusRepo();
    user = await Server.insertUser(ioc);
  });

  it('gets user status', async () => {
    const result = await server.get(`/api/user/${user.id}/status`);

    expect(result.status).to.equal(200);
    const { status } = result.body;
    expect(status).to.equal('unknown');
  });

  it('gets user status if known', async () => {
    await syncStatusRepo.setOnedriveSync(user);

    const result = await server.get(`/api/user/${user.id}/status`);

    expect(result.status).to.equal(200);
    const { status } = result.body;
    expect(status).to.equal('onedriveSync');
  });
});
