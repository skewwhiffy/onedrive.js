'use strict';
import untildify from 'untildify';
import crypto from 'crypto';
import { promises as fs } from 'fs';

export default class {
  async hash(file) {
    const filePath = untildify(file);
    const shasum = crypto.createHash('sha1');
    const stream = await fs.readFile(filePath);
    shasum.update(stream);
    const hash = await shasum.digest('hex');
    return hash.toUpperCase();
  }
}
