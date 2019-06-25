'use strict';
import os from 'os';
import path from 'path';

const homeDirectory = os.homedir();
const configDirectory = path.join(homeDirectory, '.config/onedrive.js');
const syncDirectory = path.join(homeDirectory, 'onedrive.js');

export default {
  configDirectory,
  syncDirectory,
  db: path.join(configDirectory, 'db.sqlite')
};
