'use strict';
import path from 'path';
import { expect } from 'chai';
import _ from 'lodash';
import Server from '../../test.utils/integration.setup';
import FolderSync from './folder.sync';

describe('Folder sync worker', () => {
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
    worker = await ioc.instantiate(FolderSync);
  });

  it('creates sync folder', async () => {
    await worker.run();

    await fs.access(config.syncDirectory);
  });

  it('creates unknown folders', async () => {
    await syncStatusRepo.setLocalSync(user);
    const folders = _.range(5).map(it => ({
      userId: user.id,
      name: `folder${it + 1}`,
      id: `folder${it + 1}Id`,
      parentFolderId: rootFolder.id,
      onedriveStatus: 'exists',
      localStatus: 'unknown'
    }));
    await fileRepo.upsertFolder(folders);

    await worker.run();

    const dir = await fs.readdir(config.syncDirectory);
    expect(dir).to.eql(folders.map(it => it.name));
  });

  it('creates unknown folders outside of root', async () => {
    await syncStatusRepo.setLocalSync(user);
    const topFolder = {
      userId: user.id,
      name: 'topFolder',
      id: 'topFolderId',
      parentFolderId: rootFolder.id,
      onedriveStatus: 'exists',
      localStatus: 'exists'
    };
    const folders = _.range(5).map(it => ({
      userId: user.id,
      name: `folder${it + 1}`,
      id: `folder${it + 1}Id`,
      parentFolderId: 'topFolderId',
      onedriveStatus: 'exists',
      localStatus: 'unknown'
    }));
    await fileRepo.upsertFolder(topFolder, ...folders);

    await worker.run();

    const topFolderPath = path.join(config.syncDirectory, topFolder.name);
    const dir = await fs.readdir(topFolderPath);
    expect(dir).to.eql(folders.map(it => it.name));
  });
});
