'use strict';
import Server from '../../test.utils/integration.setup';
import FileSync from './file.sync';

describe.only('File sync worker', () => {
  let ioc;
  let user;
  let config;
  let rootFolder;
  let syncStatusRepo;
  let fileRepo;
  let fs;
  let worker;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    config = await ioc.getConfig();
    rootFolder = await Server.insertRootFolder(user, ioc);
    syncStatusRepo = await ioc.getSyncStatusRepo();
    fileRepo = await ioc.getFileRepo();
    fs = (await ioc.getFs()).promises;
    worker = await ioc.instantiate(FileSync);
  });

  it('Skips if there is are unknown folders', async () => {
    await fileRepo.upsertFolder({
      userId: user.id,
      name: 'folder',
      id: 'folderId',
      parentFolderId: rootFolder.id,
      onedriveStatus: 'unknown',
      localStatus: 'unknown'
    });
    fileRepo.getLocalUnknownFiles = async () => { throw Error('NO'); };

    await worker.run();
  });

  it('Skips if current file has same sha as onedrive version', async () => {

  });
});
