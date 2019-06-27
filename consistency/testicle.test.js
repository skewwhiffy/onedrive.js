'use strict';
import path from 'path';
import untildify from 'untildify';
import fs from 'fs';
import oneDriveApi from 'onedrive-api';
import { expect } from 'chai';
import Config from '../config';
import apiSetup from '../server/setup/api';

describe.skip('Testicle', () => {
  let userRepo;
  let onedriveService;
  let fileRepo;
  let shaGenerator;

  beforeEach(async () => {
    const config = await Config.init();
    const { ioc } = await apiSetup(config);
    userRepo = await ioc.getUserRepo();
    onedriveService = await ioc.getOnedriveService();
    fileRepo = await ioc.getFileRepo();
    shaGenerator = await ioc.getShaGenerator();
  });

  it('downloads nicely', async () => {
    const users = await userRepo.get();
    const user = users[0];
    const { accessToken } = await onedriveService.getAccessToken(user.refreshToken);
    const cacheFolder = untildify('~/.config/onedrive.js/cache');
    const files = await fileRepo.getLocalUnknownFiles(user, 1);
    const file = files[0];
    const target = path.join(cacheFolder, file.name);
    const targetStream = await fs.createWriteStream(target);
    const downloadStream = oneDriveApi.items.download({
      accessToken,
      itemId: file.id
    });
    const pipe = downloadStream.pipe(targetStream);
    const endPromise = new Promise((resolve, reject) => {
      pipe.on('finish', resolve);
      pipe.on('error', reject);
    });
    await endPromise;
    const sha = await shaGenerator.hash(target);
    /* eslint-disable-next-line no-console */
    console.log(target);
    expect(sha).to.equal(file.onedriveStatus);
  });
});
