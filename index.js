'use strict';
import sqlite from 'sqlite3';
import fs from 'es6-fs';
import apiSetup from './server/setup/api';
import config from './config';

const server = async () => {
  const port = 38080;
  const app = await apiSetup(config);

  // Ensure config directory exists
  await fs.mkdir(config.configDirectory, { recursive: true });

  // Ensure DB exists
  const db = new sqlite.Database(config.db);
  await db.close();

  /* eslint-disable no-console */
  app.listen(port, () => console.log(`Listening on port ${port}`));
  /* eslint-enable no-console */
};

server();
