'use strict';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('User repository', () => {
  let ioc;
  let userRepo;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    userRepo = await ioc.getUserRepo();
  });

  it('inserts and gets', async () => {
    const user = await Server.insertUser(ioc);

    const users = await userRepo.get();

    expect(users).to.have.length(1);
    expect(users[0]).to.eql(user);
  });
});
