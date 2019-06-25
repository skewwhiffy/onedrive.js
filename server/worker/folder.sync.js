'use strict';
import autobind from 'auto-bind';

export default class {
  constructor(logger, userRepo, syncStatusRepo, fileRepo) {
    this.logger = logger;
    this.userRepo = userRepo;
    this.syncStatusRepo = syncStatusRepo;
    this.fileRepo = fileRepo;
    this.pauseMillis = 1000;
    autobind(this);
  }

  async run() {
    const users = await this.userRepo.get();
    // TODO: Multiple users
    const user = users[0];
    const status = await this.syncStatusRepo.get(user);
    if (status.status !== 'localSync') return;

    const folders = await this.fileRepo.getLocalUnknownFolders(user, 200);

  }
}
