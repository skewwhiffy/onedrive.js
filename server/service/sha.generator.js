'use strict';
import untildify from 'untildify';
import crypto from 'crypto';

export default class {
  constructor(fs) {
    this.fs = fs;
  }

  async hash(file) {
    const filePath = untildify(file);
    const shasum = crypto.createHash('sha1');
    const stream = await this.fs.readFile(filePath);
    shasum.update(stream);
    const hash = await shasum.digest('hex');
    return hash.toUpperCase();
  }
}
