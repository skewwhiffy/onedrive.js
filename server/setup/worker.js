'use strict';
import fs from 'es6-fs';
import path from 'path';
import dynamicRequire from '../utils/dynamic.require';

const testSuffix = 'test.js';
const workerSuffix = '.js';
const workerDirectory = path.join(__dirname, '../worker');

const pause = millis => new Promise(resolve => setTimeout(resolve, millis));

export default async ioc => {
  const workers = await fs.readdir(workerDirectory);
  const workerNames = workers
    .filter(it => it.endsWith(workerSuffix))
    .filter(it => !it.endsWith(testSuffix));

  await Promise.all(workerNames
    .map(name => dynamicRequire(path.join(workerDirectory, name)))
    .map(it => new it(ioc))
    .map(async it => {
      /* eslint-disable no-constant-condition */
      while (true) {
      /* eslint-enable no-constant-condition */
        await it.run();
        /* eslint-disable no-await-in-loop */
        await pause(it.pauseMillis);
        /* eslint-enable no-await-in-loop */
      }
    }));
};
