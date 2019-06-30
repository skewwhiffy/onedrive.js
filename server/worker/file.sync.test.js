'use strict';
import path from 'path';
import Server from '../../test.utils/integration.setup';
import FileSync from './file.sync';

describe('File sync worker', () => {
  let ioc;
  let user;
  let config;
  let rootFolder;
  let fileRepo;
  let fs;
  let shaGenerator;
  let worker;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    config = await ioc.getConfig();
    rootFolder = await Server.insertRootFolder(user, ioc);
    fileRepo = await ioc.getFileRepo();
    fs = (await ioc.getFs()).promises;
    shaGenerator = await ioc.getShaGenerator();
    worker = await ioc.instantiate(FileSync);
  });

  it('Skips if current file has same sha as onedrive version', async () => {
    const fileName = 'file.txt';
    const target = path.join(config.syncDirectory, fileName);
    await fs.mkdir(config.syncDirectory, { recursive: true });
    await fs.writeFile(target, 'hello world');
    const file = {
      userId: user.id,
      name: fileName,
      id: 'fileId',
      parentFolderId: rootFolder.id,
      onedriveStatus: await shaGenerator.hash(target),
      localStatus: 'unknown'
    };
    await fileRepo.upsertFile(file);

    await worker.run();

    const check = async () => {
      const files = await fileRepo.getFiles(user);
      if (files[0].localStatus === file.onedriveStatus) return;
      await new Promise(resolve => setTimeout(resolve, 100));
      await check();
    };
    await check();
  });
});
