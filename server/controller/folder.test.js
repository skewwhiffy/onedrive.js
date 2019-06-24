'use strict';
import _ from 'lodash';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('GET /api/user/:userId/folder/:pathToFolder', () => {
  let ioc;
  let user;
  let server;
  let fileRepo;

  beforeEach(async () => {
    ({ server, ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    fileRepo = await ioc.getFileRepo();
  });

  it('returns root folders', async () => {
    const folders = _.range(3)
      .map(it => `folder${it}`)
      .map(name => ({ userId: user.id, name, id: `${name}id` }));
    await fileRepo.upsertFolder(folders);

    const result = await server.get(`/api/user/${user.id}/folder/`);

    expect(result.status).to.equal(200);
    const returnedFolders = result.body;
    expect(returnedFolders).to.eql(folders);
  });

  it('returns deeper folders', async () => {
    const topFolder = { userId: user.id, name: 'topFolder', id: 'topFolderId' };
    const nextFolder = {
      userId: user.id,
      name: 'nextFolder',
      id: 'nextFolderId',
      parentFolderId: 'topFolderId'
    };
    const subFolders = _.range(3)
      .map(it => `folder${it}`)
      .map(name => ({
        userId: user.id,
        name,
        id: `${name}id`,
        parentFolderId: 'nextFolderId'
      }));
    await fileRepo.upsertFolder(topFolder, nextFolder, ...subFolders);

    const result = await server.get(`/api/user/${user.id}/folder/topFolder/nextFolder`);

    expect(result.status).to.equal(200);
    const returnedFolders = result.body;
    expect(returnedFolders).to.eql(subFolders);
  });
});
