'use strict';
const path = require('path');

const configDirectory = '~/.config/onedrive.js';

module.exports = {
  configDirectory,
  db: path.join(configDirectory, 'db.sqlite')
};
