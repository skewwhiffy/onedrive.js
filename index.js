'use strict';
import sqlite from 'sqlite3';
import fs from 'es6-fs';
import apiSetup from './server/setup/api';
import workerSetup from './server/setup/worker';
import config from './config';

const server = async () => {
  const port = 38080;

  // Ensure config directory exists
  await fs.mkdir(config.configDirectory, { recursive: true });

  // Ensure DB exists
  const db = new sqlite.Database(config.db);
  await db.close();

  const { app, ioc } = await apiSetup(config);

  const logger = await ioc.getLogger();
  app.listen(port, () => logger.info(`Listening on port ${port}`));
  await workerSetup(ioc);
};

server();
