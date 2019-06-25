'use strict';
import autobind from 'auto-bind';

const maxPauseMillis = 60000;

export default class {
  constructor(logger, deltaRepo, userRepo, onedriveService) {
    this.currentPauseMillis = 1000;
    this.deltaRepo = deltaRepo;
    this.userRepo = userRepo;
    this.onedriveService = onedriveService;
    this.logger = logger;
    autobind(this);
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
    if (delta.value.length === 0) {
      this.logger.info('All changes processed: backing off');
      this.currentPauseMillis = Math.min(maxPauseMillis, this.currentPauseMillis * 2);
    } else {
      this.currentPauseMillis = 1000;
    }
  }

  get pauseMillis() {
    return this.currentPauseMillis;
  }
}
