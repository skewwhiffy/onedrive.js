'use strict';
import shortId from 'shortid';
import { Readable } from 'stream';
import { expect } from 'chai';
import path from 'path';
import Server from '../../test.utils/integration.setup';
import FileSync from './file.sync';

const fileContents = 'hello world';
const sha = '2AAE6C35C94FCFB415DBE95F408B9CE91EE846ED';

describe('File sync worker', () => {
  let ioc;
  let user;
  let config;
  let rootFolder;
  let fileRepo;
  let fs;
  let worker;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    config = await ioc.getConfig();
    rootFolder = await Server.insertRootFolder(user, ioc);
    fileRepo = await ioc.getFileRepo();
    fs = (await ioc.getFs()).promises;
    worker = await ioc.instantiate(FileSync);
  });

  it('Skips if current file has same sha as onedrive version', async () => {
    const fileName = 'file.txt';
    const target = path.join(config.syncDirectory, fileName);
    await fs.mkdir(config.syncDirectory, { recursive: true });
    await fs.writeFile(target, fileContents);
    const file = {
      userId: user.id,
      name: fileName,
      id: 'fileId',
      parentFolderId: rootFolder.id,
      onedriveStatus: sha,
      localStatus: 'unknown'
    };
    await fileRepo.upsertFile(file);

    await worker.run();

    const check = async loopGuard => {
      if (!loopGuard) {
        await check(1);
        return;
      }
      expect(loopGuard).to.be.lessThan(10);
      const files = await fileRepo.getFiles(user);
      if (files[0].localStatus === sha) return;
      await new Promise(resolve => setTimeout(resolve, 100));
      await check();
    };
    await check();
  });

  it('Downloads and saves file from onedrive if it does not exist already', async () => {
    const fileName = 'file.txt';
    const stream = new Readable();
    stream.push(fileContents);
    stream.push(null);
    const accessToken = shortId();
    let onedriveAccessTokenPayload = false;
    let onedrivePayload = false;
    const target = path.join(config.syncDirectory, fileName);
    await fs.mkdir(config.syncDirectory, { recursive: true });
    const onedriveService = await ioc.getOnedriveService();
    onedriveService.getAccessToken = async payload => {
      onedriveAccessTokenPayload = payload;
      return { accessToken };
    };
    const onedriveApi = await ioc.getOnedriveApi();
    onedriveApi.items = {
      download: payload => {
        onedrivePayload = payload;
        return stream;
      }
    };
    const file = {
      userId: user.id,
      name: fileName,
      id: 'fileId',
      parentFolderId: rootFolder.id,
      onedriveStatus: sha,
      localStatus: 'unknown'
    };
    await fileRepo.upsertFile(file);

    await worker.run();

    const check = async loopGuard => {
      if (!loopGuard) {
        await check(1);
        return;
      }
      expect(loopGuard).to.be.lessThan(10);
      const files = await fileRepo.getFiles(user);
      if (files[0].localStatus !== sha) {
        await new Promise(resolve => setTimeout(resolve, 100));
        await check(loopGuard + 1);
      }
    };
    await check();
    expect(onedriveAccessTokenPayload).to.equal(user.refreshToken);
    expect(onedrivePayload).to.eql({ accessToken, itemId: file.id });
    const newFile = await fs.readFile(target);
    expect(newFile.toString()).to.equal(fileContents);
  });
});
