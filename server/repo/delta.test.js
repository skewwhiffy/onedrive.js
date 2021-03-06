'use strict';
import path from 'path';
import { promises as fs } from 'fs';
import Server from '../../test.utils/integration.setup';
import { expect } from 'chai';

describe('Delta repository', () => {
  let entities;
  let sampleData;
  let user;
  let syncStatusRepo;
  let deltaRepo;

  beforeEach(async () => {
    const { ioc } = await Server.init();
    entities = await ioc.getEntities();
    // TODO: Construct own sample data
    const sampleDataFile = path.join(__dirname, 'sample.delta.json');
    const sampleDataBuffer = await fs.readFile(sampleDataFile);
    const sampleDataText = sampleDataBuffer.toString();
    sampleData = JSON.parse(sampleDataText);
    user = await Server.insertUser(ioc);
    syncStatusRepo = await ioc.getSyncStatusRepo();
    deltaRepo = await ioc.getDeltaRepo();
  });

  it('populates all folders', async () => {
    const expected = sampleData
      .value
      .filter(it => it.folder)
      .map(it => ({
        userId: user.id,
        name: it.name,
        id: it.id,
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id,
        onedriveStatus: it.deleted ? 'deleted' : 'exists',
        localStatus: 'unknown'
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
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id,
        onedriveStatus: it.file.hashes.sha1Hash,
        localStatus: 'unknown'
      }));

    await deltaRepo.process({ user, delta: sampleData });

    const fileEntities = await entities.File.findAll();
    expect(JSON.parse(JSON.stringify(fileEntities))).to.eql(expected);
  });

  it('populates status and next token', async () => {
    await deltaRepo.process({ user, delta: sampleData });

    const status = await syncStatusRepo.get(user);

    expect(status.nextLink).to.equal(sampleData['@odata.nextLink']);
    expect(status.status).to.equal('onedriveSync');
  });

  it('is idempotent', async () => {
    await deltaRepo.process({ user, delta: sampleData });
    await deltaRepo.process({ user, delta: sampleData });

    const status = await syncStatusRepo.get(user);

    expect(status.nextLink).to.equal(sampleData['@odata.nextLink']);
    expect(status.status).to.equal('onedriveSync');
  });
  // TODO: Test deletes
});
