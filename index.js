'use strict';
const sqlite = require('sqlite3');
const fs = require('es6-fs');
const apiSetup = require('./server/setup/api');
const config = require('./config');

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
