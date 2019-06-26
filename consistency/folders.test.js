'use strict';
import { expect } from 'chai';
import { promises as fs } from 'fs';
import untildify from 'untildify';
import path from 'path';

describe('Folders', function desc() {
  this.timeout(10000);
  const existing = '~/OneDrive';
  const toCheck = '~/onedrive.js';

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
});
