'use strict';
import autobind from 'auto-bind';

const maxPauseMillis = 60000;

export default class {
  constructor(logger, config, fs, userRepo, syncStatusRepo, fileRepo) {
    this.logger = logger;
    this.config = config;
    this.fs = fs;
    this.userRepo = userRepo;
    this.syncStatusRepo = syncStatusRepo;
    this.fileRepo = fileRepo;
    this.pauseMillis = 100;
    autobind(this);
  }

  backoff() {
    this.pauseMillis = Math.min(maxPauseMillis, this.pauseMillis * 2);
  }

  async run() {
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

    this.logger.warn('File sync not implemented yet...');
  }
}
