'use strict';
import { expect } from 'chai';
import { promises as fs } from 'fs';
import untildify from 'untildify';
import path from 'path';
import ShaGenerator from '../server/service/sha.generator';

describe('Folders', function desc() {
  this.timeout(10000);
  const existing = '~/OneDrive';
  const toCheck = '~/onedrive.js';
  const shaGenerator = new ShaGenerator(fs);

  it('are consistent', async () => {
    const originalQueue = [''];
    const check = async queue => {
      if (queue.length === 0) return;
      const originalPath = path.join(untildify(existing), queue[0]);
      const newPath = path.join(untildify(toCheck), queue[0]);
      const [originalItems, newItems] = await Promise
        .all([originalPath, newPath].map(it => fs.readdir(it)));
      const getDirectories = async (start, items) => {
        const promises = items
          .map(async name => ({ name, lstat: await fs.lstat(path.join(start, name)) }));
        const typedItems = await Promise.all(promises);
        return typedItems.filter(it => it.lstat.isDirectory()).map(it => it.name);
      };
      const [originalDirectories, newDirectories] = await Promise.all([
        getDirectories(originalPath, originalItems),
        getDirectories(newPath, newItems)
      ]);
      expect(originalDirectories).to.eql(newDirectories);
      check([...queue.slice(1), ...newDirectories.map(it => path.join(queue[0], it))]);
    };
    check(originalQueue);
  });

  it('checking consistency for 10 random files', async () => {
    const found = [];
    const toCheckAbs = untildify(toCheck);
    const traverseFolders = async root => {
      const originalPath = path.join(toCheckAbs, root);
      const items = await fs.readdir(originalPath);
      const itemsWithLstat = await Promise.all(items
        .map(async name => ({ name, lstat: await fs.lstat(path.join(toCheckAbs, root, name)) })));
      const directories = itemsWithLstat.filter(it => it.lstat.isDirectory()).map(it => it.name);
      const files = itemsWithLstat.filter(it => !it.lstat.isDirectory()).map(it => it.name);
      found.push(...files.map(it => path.join(root, it)));
      const newRoots = directories.map(it => path.join(root, it));
      await Promise.all(newRoots.map(it => traverseFolders(it)));
    };
    await traverseFolders('');

    expect(found).to.have.length.at.least(10);
    await Promise.all(found.slice(0, 10).map(async file => {
      const [existingSha, toCheckSha] = await Promise.all(
        [existing, toCheck]
          .map(it => path.join(it, file))
          .map(it => shaGenerator.hash(it))
      );
      expect(existingSha).to.equal(toCheckSha);
    }));
    /* eslint-disable-next-line no-console */
    console.log(`Found ${found.length} files`);
  });
});
