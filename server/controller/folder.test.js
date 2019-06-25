'use strict';
import _ from 'lodash';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('GET /api/user/:userId/folder/:pathToFolder', () => {
  let ioc;
  let user;
  let rootFolder;
  let server;
  let fileRepo;

  beforeEach(async () => {
    ({ server, ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    rootFolder = await Server.insertRootFolder(user, ioc);
    fileRepo = await ioc.getFileRepo();
  });

  it('returns root folders and files', async () => {
    const userId = user.id.toString();
    const folders = _.range(3)
      .map(it => `folder${it}`)
      .map(name => ({
        userId,
        name,
        id: `${name}id`,
        parentFolderId: rootFolder.id,
        onedriveStatus: 'unknown',
        localStatus: 'unknown'
      }));
    const files = _.range(3)
      .map(it => `file${it}`)
      .map(name => ({
        userId,
        name,
        id: `${name}id`,
        parentFolderId: rootFolder.id,
        onedriveStatus: 'unknown',
        localStatus: 'unknown'
      }));

    await fileRepo.upsertFolder(folders);
    await fileRepo.upsertFile(files);

    const result = await server.get(`/api/user/${user.id}/folder/`);

    expect(result.status).to.equal(200);
    const returnedFolders = result.body;
    expect(returnedFolders).to.eql({ folders, files });
  });

  it('returns deeper folders', async () => {
    const userId = user.id.toString();
    const topFolder = {
      userId,
      name: 'topFolder',
      id: 'topFolderId',
      parentFolderId: rootFolder.id,
      onedriveStatus: 'unknown',
      localStatus: 'unknown'
    };
    const nextFolder = {
      userId,
      name: 'nextFolder',
      id: 'nextFolderId',
      parentFolderId: 'topFolderId',
      onedriveStatus: 'unknown',
      localStatus: 'unknown'
    };
    const subFolders = _.range(3)
      .map(it => `folder${it}`)
      .map(name => ({
        userId,
        name,
        id: `${name}id`,
        parentFolderId: 'nextFolderId',
        onedriveStatus: 'unknown',
        localStatus: 'unknown'
      }));
    const files = _.range(3)
      .map(it => `file${it}`)
      .map(name => ({
        userId,
        name,
        id: `${name}id`,
        parentFolderId: 'nextFolderId',
        onedriveStatus: 'unknown',
        localStatus: 'unknown'
      }));
    await fileRepo.upsertFolder(topFolder, nextFolder, ...subFolders);
    await fileRepo.upsertFile(files);

    const result = await server.get(`/api/user/${user.id}/folder/topFolder/nextFolder`);

    expect(result.status).to.equal(200);
    const returnedFolders = result.body;
    expect(returnedFolders).to.eql({ folders: subFolders, files });
  });
});
