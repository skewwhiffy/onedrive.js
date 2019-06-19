'use strict';
import shortId from 'shortid';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('User repository', () => {
  let userRepo;

  beforeEach(async () => {
    const { ioc } = await Server.init();
    userRepo = await ioc.getUserRepo();
  });

  it('inserts and gets', async () => {
    const user = { email: `${shortId()}@test.com` };
    await userRepo.insert(user);

    const users = await userRepo.get();

    expect(users).to.have.length(1);
    expect(users[0].email).to.equal(user.email);
  });
});
