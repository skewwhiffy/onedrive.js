'use strict';
import autobind from 'auto-bind';

export default class {
  constructor(print) {
    /* eslint-disable-next-line no-console */
    this.print = print || console.log;
    autobind(this);
  }

  log(level, message) { this.print(`[${level}] : ${message}`); }

  debug(message) { this.log('DEBUG', message); }

  info(message) { this.log('INFO', message); }

  warn(message) { this.log('WARN', message); }

  error(message) { this.log('ERROR', message); }
}
