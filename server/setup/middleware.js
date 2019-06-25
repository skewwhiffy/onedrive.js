'use strict';
import dynamicRequire from '../utils/dynamic.require';
import { promises as fs } from 'fs';
import path from 'path';

const middlewareDirectory = path.join(__dirname, '../middleware');

export default {
  init: async ioc => {
    const app = await ioc.getApp();
    const middlewareFiles = await fs.readdir(middlewareDirectory);
    const middlewareImports = middlewareFiles
      .map(it => dynamicRequire(path.join(middlewareDirectory, it)))
      .map(It => new It());
    middlewareImports.forEach(it => app.use(it.run));
  }
};
