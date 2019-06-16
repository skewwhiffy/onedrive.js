'use strict';
import { expect } from 'chai';
import safeId from 'generate-safe-id';
import Server from '../../test.utils/integration.setup';

describe('GET /api/user', () => {
  let ioc;
  let userRepo;
  let server;

  beforeEach(async () => {
    ({ ioc, server } = await Server.init());
    userRepo = await ioc.getUserRepo();
  });

  it('gets users', async () => {
    const user = { email: `${safeId()}@test.com` };
    await userRepo.insert(user);

    const result = await server.get('/api/user');

    expect(result.status).to.equal(200);
    const users = result.body;
    expect(users).to.have.length(1);
    expect(users[0].email).to.equal(user.email);
  });
});
