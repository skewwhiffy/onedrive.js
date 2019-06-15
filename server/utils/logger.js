'use strict';
const autobind = require('auto-bind');

module.exports = class {
  constructor(print) {
    /* eslint-disable no-console */
    this.print = print || console.log;
    /* eslint-enable no-console */
    autobind(this);
  }

  log(level, message) { this.print(`[${level}] : ${message}`); }

  info(message) { this.log('INFO', message); }

  warn(message) { this.log('WARN', message); }

  error(message) { this.log('ERROR', message); }
};
