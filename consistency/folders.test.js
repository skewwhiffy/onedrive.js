'use strict';
import { promises as fs } from 'fs';
import untildify from 'untildify';
import path from 'path';
import _ from 'lodash';

describe.only('Folders are consistent', () => {
  const existing = '~/OneDrive';
  // const toCheck = '~/onedrive';

  const getFolders = async root => {
    const rootPath = untildify(root);
    const contents = await fs.readdir(rootPath);
    const contentsWithLstats = await Promise.all(contents
      .map(it => path.join(rootPath, it))
      .map(async itemPath => ({ itemPath, lstat: await fs.lstat(itemPath) })));
    const directSubfolders = contentsWithLstats
      .filter(it => it.lstat.isDirectory())
      .map(it => it.itemPath);
    console.log(directSubfolders);
    throw Error();
    const subFolderCollections = await Promise.all(directSubfolders
      .map(it => getFolders(it)));
    const subFolders = _.flatten(subFolderCollections);
    return [...directSubfolders, subFolders];
  };

  it('folders in existing exist in toCheck', async () => {
    const existingFolders = await getFolders(existing);

    console.log(existingFolders);
  });
});
