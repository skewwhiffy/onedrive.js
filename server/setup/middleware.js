'use strict';
const fs = require('es6-fs');
const path = require('path');
const dynamicRequire = require('../utils/dynamic.require');

const middlewareDirectory = path.join(__dirname, '../middleware');

module.exports.init = async ioc => {
  const app = await ioc.getApp();
  const middlewareFiles = await fs.readdir(middlewareDirectory);
  const middlewareImports = middlewareFiles
    .map(it => dynamicRequire(path.join(middlewareDirectory, it)))
    .map(It => new It(ioc));
  middlewareImports.forEach(it => app.use(it.run));
};
