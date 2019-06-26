'use strict';
import path from 'path';
import autobind from 'auto-bind';
import shortId from 'shortid';

const maxPauseMillis = 60000;
const numberOfDownloads = 10;

export default class {
  constructor(logger, config, fs, userRepo, syncStatusRepo, fileRepo) {
    this.logger = logger;
    this.config = config;
    this.fs = fs;
    this.userRepo = userRepo;
    this.syncStatusRepo = syncStatusRepo;
    this.fileRepo = fileRepo;
    this.pauseMillis = 3000; // reduce later
    this.downloading = {};
    autobind(this);
  }

  backoff() {
    this.pauseMillis = Math.min(maxPauseMillis, this.pauseMillis * 2);
  }

  async run() {
    const currentNumberOfDownloads = Object.keys(this.downloading).length;
    if (currentNumberOfDownloads >= numberOfDownloads) {
      this.logger.info(`Already downloading ${numberOfDownloads} - backing off`);
      this.backoff();
      return;
    }
    const users = await this.userRepo.get();
    const user = users[0];
    if (!user) {
      this.logger.info('No user logged in, backing off');
      this.backoff();
      return;
    }
    const folders = await this.fileRepo.getLocalUnknownFolders(user, 1);

    if (folders.length !== 0) {
      this.logger.info('Folders still need syncing, backing off');
      this.backoff();
      return;
    }

    const files = await this.fileRepo
      .getLocalUnknownFiles(user, numberOfDownloads - currentNumberOfDownloads);
    files.forEach(this.download);
  }

  async download(file) {
    try {
      await this.fs.access(this.config.cacheDirectory);
    } catch (err) {
      await this.fs.mkdir(this.config.cacheDirectory, { recursive: true });
    }

    const cacheFileRelativePath = shortId();
    const cacheFilePath = path.join(this.config.cacheDirectory, cacheFileRelativePath);
    const relativePath = await this.fileRepo.getPath(file);
    this.downloading[cacheFileRelativePath] = path.join(this.config.syncDirectory, relativePath);
    console.log(this.downloading);
    this.logger.warn('File sync not implemented yet...');
    this.backoff();
  }
}
