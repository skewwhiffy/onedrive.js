'use strict';
import untildify from 'untildify';
import crypto from 'crypto';

export default class {
  constructor(fs) {
    this.fs = fs.promises;
  }

  async hash(file) {
    const filePath = untildify(file);
    const shasum = crypto.createHash('sha1');
    try {
      const stream = await this.fs.readFile(filePath);
      shasum.update(stream);
      const hash = await shasum.digest('hex');
      return hash.toUpperCase();
    } catch (err) {
      if (err.code === 'ENOENT') return false;
      throw err;
    }
  }
}
