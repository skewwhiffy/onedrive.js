'use strict';
import _ from 'lodash';
import shortId from 'shortid';
import Server from '../../test.utils/integration.setup';
import { expect } from 'chai';

describe('File repository', () => {
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

  it('can insert folder at root and retrieve', async () => {
    const folder = {
      userId: user.id,
      name: shortId(),
      id: shortId()
    };

    await fileRepo.upsertFolder(folder);
    const fromRepo = await fileRepo.getFolders(user, '/');

    expect(fromRepo).to.have.length(1);
  });

  it('can insert folder at random paths', async () => {
    const folderEntities = [{
      userId: user.id, name: 'folder0', id: 'folder0id'
    }, ..._.range(2).map(it => ({
      userId: user.id,
      name: `folder${it + 1}`,
      id: `folder${it + 1}id`,
      parentFolderId: `folder${it}id`
    }))];

    await fileRepo.upsertFolder(...folderEntities);

    const firstResponse = await fileRepo.getFolders(user, 'folder0');
    const secondResponse = await fileRepo.getFolders(user, '/folder0/folder1');
    const thirdResponse = await fileRepo.getFolders(user, 'folder0/not.a.folder');

    expect(firstResponse.map(it => it.name)).to.have.members(['folder1']);
    expect(secondResponse.map(it => it.name)).to.have.members(['folder2']);
    expect(thirdResponse).to.be.empty();
  });
});
