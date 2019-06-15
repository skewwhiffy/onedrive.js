'use strict';
const fs = require('es6-fs');
const path = require('path');
const dynamicRequire = require('./utils/dynamic.require');

const middlewareDirectory = path.join(__dirname, 'middleware');

module.exports.init = async (app, config) => {
  const middlewareFiles = await fs.readdir(middlewareDirectory);
  const middlewareImports = middlewareFiles
    .map(it => dynamicRequire(path.join(middlewareDirectory, it)))
    .map(It => new It(config));
  middlewareImports.forEach(it => app.use(it.run));
};
