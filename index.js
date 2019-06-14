'use strict';
const express = require('express');
const apiSetup = require('./server/api.setup');

const server = async () => {
  const app = express();
  const port = 38080;
  apiSetup(app);

  /* eslint-disable no-console */
  app.listen(port, () => console.log(`Listening on port ${port}`));
  /* eslint-enable no-console */
};

server();
