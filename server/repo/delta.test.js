'use strict';
import shortId from 'shortid';
import path from 'path';
import fs from 'es6-fs';
import Server from '../../test.utils/integration.setup';
import { expect } from 'chai';

describe.only('Delta repository', () => {
  let entities;
  let sampleData;
  let user;
  let deltaRepo;

  before(async () => {
    const { ioc } = await Server.init();
    entities = await ioc.getEntities();
    const sampleDataFile = path.join(__dirname, 'sample.delta.json');
    const sampleDataBuffer = await fs.readFile(sampleDataFile);
    const sampleDataText = sampleDataBuffer.toString();
    sampleData = JSON.parse(sampleDataText);
    user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    deltaRepo = await ioc.getDeltaRepo();

    const userRepo = await ioc.getUserRepo();
    user = await userRepo.insert(user);
    await deltaRepo.process({ user, delta: sampleData });
  });

  it('populates all folders', async () => {
    const expected = sampleData
      .value
      .filter(it => it.folder)
      .map(it => ({
        userId: user.id,
        name: it.name,
        id: it.id,
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id
      }));

    const folderEntities = await entities.Folder.findAll();

    expect(JSON.parse(JSON.stringify(folderEntities))).to.eql(expected);
  });
});
