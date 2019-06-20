'use strict';

export default class {
  constructor(ioc) {
    this.pauseMillis = 1000;
    this.ioc = ioc;
  }

  async run() {
    const userRepo = await this.ioc.getUserRepo();
    const onedrive = await this.ioc.getOnedriveService();
    const users = await userRepo.get();
    const { refreshToken } = users[0];
    const { accessToken } = await onedrive.getAccessToken(refreshToken);
    const delta = await onedrive.getDelta(accessToken);
  }
}
