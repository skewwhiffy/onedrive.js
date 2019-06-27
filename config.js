'use strict';
import fsExtra from 'fs-extra';
import { promises as fs } from 'fs';
import untildify from 'untildify';
import path from 'path';
import os from 'os';

const init = async () => {
  const configDirectory = path.join(os.homedir(), '.config/onedrive.js');
  const configFilename = path.join(configDirectory, 'config.json');
  await fsExtra.ensureDir(configDirectory);
  const configFileExists = await fsExtra.pathExists(configFilename);
  if (!configFileExists) await fs.copyFile('./default.config.json', configFilename);
  const configFileBuffer = await fs.readFile(configFilename);
  const config = JSON.parse(configFileBuffer.toString());
  ['db', 'syncDirectory', 'cacheDirectory']
    .forEach(key => { config[key] = untildify(config[key]); });
  await fsExtra.remove(config.cacheDirectory);
  return config;
};

export default { init };
