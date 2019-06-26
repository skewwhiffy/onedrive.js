'use strict';
import sqlite from 'sqlite3';
import apiSetup from './server/setup/api';
import workerSetup from './server/setup/worker';
import Config from './config';

const server = async () => {
  const port = 38080;
  const config = await Config.init();

  // Ensure DB exists
  const db = new sqlite.Database(config.db);
  await db.close();

  const { app, ioc } = await apiSetup(config);

  const logger = await ioc.getLogger();
  app.listen(port, () => logger.info(`Listening on port ${port}`));
  await workerSetup(ioc);
};

server();
