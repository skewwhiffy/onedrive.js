'use strict';
import shortId from 'shortid';
import path from 'path';
import fs from 'es6-fs';
import Server from '../../test.utils/integration.setup';
import { expect } from 'chai';

describe('Delta repository', () => {
  let entities;
  let sampleData;
  let user;
  let deltaRepo;

  beforeEach(async () => {
    const { ioc } = await Server.init();
    entities = await ioc.getEntities();
    // TODO: Construct own sample data
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

    await deltaRepo.process({ user, delta: sampleData });

    const folderEntities = await entities.Folder.findAll();
    expect(JSON.parse(JSON.stringify(folderEntities))).to.eql(expected);
  });

  it('populates all files', async () => {
    const expected = sampleData
      .value
      .filter(it => it.file)
      .map(it => ({
        userId: user.id,
        name: it.name,
        id: it.id,
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id
      }));

    await deltaRepo.process({ user, delta: sampleData });

    const fileEntities = await entities.File.findAll();
    expect(JSON.parse(JSON.stringify(fileEntities))).to.eql(expected);
  });

  it('populates next token', async () => {
    await deltaRepo.process({ user, delta: sampleData });

    const deltaNextEntity = await entities.DeltaNext.findAll();

    expect(deltaNextEntity[0].nextLink).to.equal(sampleData['@odata.nextLink']);
    expect(deltaNextEntity[0].userId).to.equal(user.id);
  });

  it('is idempotent', async () => {
    await deltaRepo.process({ user, delta: sampleData });
    await deltaRepo.process({ user, delta: sampleData });

    const deltaNextEntity = await entities.DeltaNext.findAll();

    expect(deltaNextEntity[0].nextLink).to.equal(sampleData['@odata.nextLink']);
    expect(deltaNextEntity[0].userId).to.equal(user.id);
  });
  // TODO: Deletes
});
