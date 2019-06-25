'use strict';
import _ from 'lodash';
import Server from '../../test.utils/integration.setup';
import { expect } from 'chai';

describe('File repository', () => {
  let user;
  let fileRepo;
  let rootFolder;

  beforeEach(async () => {
    const { ioc } = await Server.init();
    user = await Server.insertUser(ioc);
    rootFolder = await Server.insertRootFolder(user, ioc);
    fileRepo = await ioc.getFileRepo();
  });

  it('can insert folder at root and retrieve', async () => {
    const folder = {
      userId: user.id,
      name: 'folder',
      id: 'folderId',
      parentFolderId: rootFolder.id
    };

    await fileRepo.upsertFolder(folder);
    const fromRepo = await fileRepo.getFolders(user, '/');

    expect(fromRepo).to.have.length(1);
    expect(fromRepo).to.eql([folder]);
  });

  it('can insert folder at random paths', async () => {
    const folders = _.range(5)
      .map(it => ({
        userId: user.id,
        name: `folder${it + 1}`,
        id: `folder${it + 1}Id`,
        parentFolderId: it === 0 ? rootFolder.id : `folder${it}Id`
      }));

    await fileRepo.upsertFolder(folders);

    const firstResponse = await fileRepo.getFolders(user, '/');
    const secondResponse = await fileRepo.getFolders(user, 'folder1');
    const thirdResponse = await fileRepo.getFolders(user, 'folder1/folder2/folder3');
    const fourthResponse = await fileRepo.getFolders(user, 'folder1/whoops');

    expect(firstResponse).to.eql([folders[0]]);
    expect(secondResponse).to.eql([folders[1]]);
    expect(thirdResponse).to.eql([folders[3]]);
    expect(fourthResponse).to.eql([]);
  });

  it('can insert files at root and retrieve', async () => {
    const files = _.range(5).map(it => ({
      userId: user.id,
      name: `file${it}`,
      id: `file${it}Id`,
      parentFolderId: rootFolder.id
    }));

    await fileRepo.upsertFile(files);
    const response = await fileRepo.getFiles(user, '/');

    expect(response).to.eql(files);
  });

  it('can insert files deeper than root and retrieve', async () => {
    const folders = _.range(5)
      .map(it => ({
        userId: user.id,
        name: `folder${it + 1}`,
        id: `folder${it + 1}Id`,
        parentFolderId: it === 0 ? rootFolder.id : `folder${it}Id`
      }));
    const files = _.range(5).map(it => ({
      userId: user.id,
      name: `file${it}`,
      id: `file${it}Id`,
      parentFolderId: 'folder5Id'
    }));
    await fileRepo.upsertFolder(folders);

    await fileRepo.upsertFile(files);
    const response = await fileRepo.getFiles(user, 'folder1/folder2/folder3/folder4/folder5');

    expect(response).to.eql(files);
  });
});
