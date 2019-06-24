'use strict';
import _ from 'lodash';

const maxPauseMillis = 60000;

export default class {
  constructor(entities, logger, deltaRepo, userRepo, onedriveService) {
    this.currentPauseMillis = 1000;
    this.entities = entities;
    this.deltaRepo = deltaRepo;
    this.userRepo = userRepo;
    this.onedriveService = onedriveService;
    this.logger = logger;
  }

  async run() {
    const users = await this.userRepo.get();
    // TODO: Multiple users
    const user = users[0];
    if (!user) return;
    const { refreshToken } = user;
    const { accessToken } = await this.onedriveService.getAccessToken(refreshToken);
    const nextLink = await this.deltaRepo.getNextLink(user);
    const delta = await this.onedriveService.getDelta(accessToken, nextLink);
    await this.deltaRepo.process({ user, delta });
    const newNextLink = delta['@odata.nextLink'];
    if (newNextLink === nextLink && this.currentPauseMillis < maxPauseMillis) {
      this.logger.info('No more data: holding back');
      this.currentPauseMillis = _.max(maxPauseMillis, this.currentPauseMillis * 2);
    } else {
      this.logger.info('That was new data');
      this.logger.info(`Old ${nextLink}`);
      this.logger.info(`New ${newNextLink}`);
      const folders = await this.entities.Folder.findAll();
      this.logger.info(`There are ${folders.length} folders in the DB`);
    }
  }

  get pauseMillis() {
    return this.currentPauseMillis;
  }
}
