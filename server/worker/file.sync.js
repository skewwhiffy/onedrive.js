'use strict';
import path from 'path';
import autobind from 'auto-bind';
import shortId from 'shortid';
// TODO: Inject so that we can mock
import oneDriveApi from 'onedrive-api';

const maxPauseMillis = 60000;
// TODO: Move to config. Although this *does* seem optimal
const numberOfDownloads = 25;

export default class {
  constructor(
    logger,
    config,
    fs,
    shaGenerator,
    onedriveService,
    userRepo,
    syncStatusRepo,
    fileRepo
  ) {
    this.logger = logger;
    this.config = config;
    this.fs = fs;
    this.shaGenerator = shaGenerator;
    this.onedriveService = onedriveService;
    this.userRepo = userRepo;
    this.syncStatusRepo = syncStatusRepo;
    this.fileRepo = fileRepo;
    this.pauseMillis = 100;
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

    const files = await this.fileRepo.getLocalUnknownFiles(user, numberOfDownloads);
    files.forEach(file => this.download(user, file));
    this.pauseMillis = 100;
  }

  async download(user, file) {
    try {
      await this.fs.promises.access(this.config.cacheDirectory);
    } catch (err) {
      await this.fs.promises.mkdir(this.config.cacheDirectory, { recursive: true });
    }

    const cacheFileRelativePath = shortId();
    const cacheFilePath = path.join(this.config.cacheDirectory, cacheFileRelativePath);
    const relativePath = await this.fileRepo.getPath(file);
    const targetFile = path.join(this.config.syncDirectory, relativePath);
    const targetFileSha = await this.shaGenerator.hash(targetFile);
    if (targetFileSha === file.onedriveStatus) {
      this.logger.info(`File ${relativePath} is already downloaded`);
      return;
    }
    if (Object.values(this.downloading).indexOf(targetFile) >= 0) return;
    this.downloading[cacheFileRelativePath] = targetFile;
    const targetStream = await this.fs.createWriteStream(cacheFilePath);
    const { accessToken } = await this.onedriveService.getAccessToken(user.refreshToken);
    const downloadStream = oneDriveApi.items.download({
      accessToken, itemId: file.id
    });
    this.logger.info(`Trying to download ${relativePath}`);
    const pipe = downloadStream.pipe(targetStream);
    try {
      await new Promise((resolve, reject) => {
        pipe.on('finish', resolve);
        pipe.on('error', reject);
      });
      this.logger.info(`Checking integrity of ${relativePath}`);
      const shaSum = await this.shaGenerator.hash(cacheFilePath);
      if (shaSum !== file.onedriveStatus) {
        this.logger.debug(`File onedriveStatus is ${file.onedriveStatus}`);
        this.logger.debug(`File sha is ${shaSum}`);
        this.logger.debug(`Cache file is ${cacheFileRelativePath}`);
        throw Error(`Integrity check for ${relativePath} failed`);
      }
      this.logger.info(`Moving ${relativePath} to sync directory`);
      await this.fs.promises.copyFile(cacheFilePath, targetFile);
      await this.fs.promises.unlink(cacheFilePath);
      this.logger.info(`Download of ${relativePath} worked`);
      await this.fileRepo.setLocalShaForFile(file, shaSum);
    } catch (err) {
      this.logger.info(`Problem downloading file ${relativePath}. I might try again soon. Backing off.`);
      this.logger.error(err);
      this.backoff();
      await this.fs.promises.unlink(cacheFilePath);
    }
    delete this.downloading[cacheFileRelativePath];
  }
}
