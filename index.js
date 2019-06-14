'use strict';
const apiSetup = require('./server/api.setup');

const server = async () => {
  const port = 38080;
  const app = await apiSetup();

  /* eslint-disable no-console */
  app.listen(port, () => console.log(`Listening on port ${port}`));
  /* eslint-enable no-console */
};

server();
