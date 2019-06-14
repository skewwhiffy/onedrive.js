'use strict';

const express = require('express');

const app = express();
const port = 38080;

app.get('/api', (req, res) => res.send('This is the API'));
app.use(express.static('resources'));

/* eslint-disable no-console */
app.listen(port, () => console.log(`Listening on port ${port}`));
/* eslint-enable no-console */
