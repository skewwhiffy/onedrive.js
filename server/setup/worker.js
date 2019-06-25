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

  const workerInstances = await Promise.all(workerNames
    .map(name => dynamicRequire(path.join(workerDirectory, name)))
    .map(it => ioc.instantiate(it)));
  await Promise.all(workerInstances.map(async it => {
    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      /* eslint-disable no-await-in-loop */
      try {
        await it.run();
      } catch (err) {
        const logger = await ioc.getLogger();
        logger.warn(err);
      }
      await pause(it.pauseMillis);
      /* eslint-enable no-await-in-loop */
    }
  }));
};
