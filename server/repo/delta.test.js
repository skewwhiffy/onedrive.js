'use strict';
import shortId from 'shortid';
import path from 'path';
import fs from 'es6-fs';
import Server from '../../test.utils/integration.setup';

describe.only('Delta repository', () => {
  let user;
  let deltaRepo;
  let sampleData;

  before(async () => {
    user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    const { ioc } = await Server.init();
    const userRepo = await ioc.getUserRepo();
    userRepo.insert(user);
    deltaRepo = await ioc.getDeltaRepo();
    const sampleDataFile = path.join(__dirname, 'sample.delta.json');
    const sampleDataBuffer = await fs.readFile(sampleDataFile);
    const sampleDataText = sampleDataBuffer.toString();
    sampleData = JSON.parse(sampleDataText);
    await deltaRepo.process({ user, delta: sampleData });
  });

  it('processes sample delta', async () => {
  });
});
