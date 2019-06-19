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
    const user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    await userRepo.insert(user);

    const users = await userRepo.get();

    expect(users).to.have.length(1);
    user.id = users[0].id;
    expect(users[0]).to.eql(user);
  });
});
