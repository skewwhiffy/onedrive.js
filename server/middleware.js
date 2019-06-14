'use strict';
const fs = require('es6-fs');
const path = require('path');

const middlewareDirectory = path.join(__dirname, 'middleware');

module.exports.init = async (app, config) => {
  const middlewareFiles = await fs.readdir(middlewareDirectory);
  console.log(middlewareFiles);
};
