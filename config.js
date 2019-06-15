'use strict';
import os from 'os';
import path from 'path';

const homeDirectory = os.homedir();
const configDirectory = path.join(homeDirectory, '.config/onedrive.js');

export default {
  configDirectory,
  db: path.join(configDirectory, 'db.sqlite')
};
