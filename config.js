'use strict';
const os = require('os');
const path = require('path');

const homeDirectory = os.homedir();
const configDirectory = path.join(homeDirectory, '.config/onedrive.js');

module.exports = {
  configDirectory,
  db: path.join(configDirectory, 'db.sqlite')
};
