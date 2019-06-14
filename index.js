'use strict';
const apiSetup = require('./server/api.setup');
const config = require('./config');

const server = async () => {
  const port = 38080;
  const app = await apiSetup(config);

  /* eslint-disable no-console */
  app.listen(port, () => console.log(`Listening on port ${port}`));
  /* eslint-enable no-console */
};

server();
