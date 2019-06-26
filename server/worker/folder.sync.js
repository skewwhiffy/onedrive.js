'use strict';
import path from 'path';
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
    this.currentPauseMillis = 100;
    autobind(this);
  }

  async run() {
    try {
      await this.fs.access(this.config.syncDirectory);
    } catch (err) {
      await this.fs.mkdir(this.config.syncDirectory, { recursive: true });
    }
    const users = await this.userRepo.get();
    // TODO: Multiple users
    const user = users[0];
    if (!user) return;
    const status = await this.syncStatusRepo.get(user);
    if (status.status !== 'localSync') return;

    const folders = await this.fileRepo.getLocalUnknownFolders(user, 50);
    if (folders.length === 0) {
      this.logger.info('Folders created, backing off');
      this.currentPauseMillis = Math.min(maxPauseMillis, this.currentPauseMillis * 2);
      return;
    }
    const foldersToEnsureExistLocally = folders.filter(it => it.onedriveStatus === 'exists');
    let foldersAdded = 0;
    await Promise.all(foldersToEnsureExistLocally.map(async it => {
      const relativeFolderPath = await this.fileRepo.getPath(it);
      const folderPath = path.join(this.config.syncDirectory, relativeFolderPath);
      try {
        await this.fs.access(folderPath);
      } catch (err) {
        await this.fs.mkdir(folderPath, { recursive: true });
        foldersAdded += 1;
      }
    }));
    if (foldersAdded === 0) this.logger.info(`Created ${foldersAdded} folders`);
    await this.fileRepo.setLocalExistsFolders(folders);
  }

  get pauseMillis() {
    return this.currentPauseMillis;
  }
}
