'use strict';
import shortId from 'shortid';
import Server from '../../test.utils/integration.setup';

describe.only('File repository', () => {
  let user;
  let fileRepo;

  beforeEach(async () => {
    const { ioc } = await Server.init();
    const userRepo = await ioc.getUserRepo();
    user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    user = await userRepo.insert(user);
    fileRepo = await ioc.getFileRepo();
  });

  it('inserts and gets', async () => {
  });
});
