'use strict';
import autobind from 'auto-bind';
import path from 'path';

const root = path.join(__dirname, '../..');

const getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;
  let callerfile;
  try {
    const err = new Error();
    Error.prepareStackTrace = (error, stack) => stack;
    const currentfile = err.stack.shift().getFileName();
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();
      if (currentfile !== callerfile) break;
    }
  } catch (e) {
    // Do nothing
  }
  Error.prepareStackTrace = originalFunc;
  return callerfile;
};

export default class {
  constructor(print) {
    /* eslint-disable-next-line no-console */
    this.print = print || console.log;
    autobind(this);
  }

  log(level, message) {
    const callerFile = getCallerFile();
    const relativeCallerFile = callerFile.substring(root.length);
    this.print(`[${level}] (${relativeCallerFile}) : ${message}`);
  }

  debug(message) { this.log('DEBUG', message); }

  info(message) { this.log('INFO', message); }

  warn(message) { this.log('*WARN', message); }

  error(message) { this.log('******ERROR', message); }
}
