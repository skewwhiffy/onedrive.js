'use strict';
const fs = require('es6-fs');
const path = require('path');

const middlewareDirectory = path.join(__dirname, 'middleware');

module.exports.init = async (app, config) => {
  const middlewareFiles = await fs.readdir(middlewareDirectory);
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const middlewareImports = middlewareFiles
    .map(it => require(path.join(middlewareDirectory, it)))
    .map(It => new It(config));
  /* eslint-enable import/no-dynamic-require */
  /* eslint-enable global-require */
  middlewareImports.forEach(it => app.use(it.run));
};
