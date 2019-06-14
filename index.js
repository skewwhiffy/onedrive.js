'use strict';
const express = require('express');
const Init = require('./server/init');

const server = async () => {
  const app = express();
  const port = 38080;
  Init.init(app);
  app.use(express.static('resources'));
  /* eslint-disable no-console */
  app.listen(port, () => console.log(`Listening on port ${port}`));
  /* eslint-enable no-console */
};

server();
