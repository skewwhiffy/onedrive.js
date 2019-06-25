'use strict';
import shortId from 'shortid';
import request from 'supertest';
import apiSetup from '../server/setup/api';
import Logger from '../server/utils/logger';

export default {
  init: async inject => {
    const testConfig = { db: ':memory:' };
    const defaultInjected = {
      logger: new Logger(() => {})
    };
    if (inject) Object.assign(defaultInjected, inject);
    const { app, ioc } = await apiSetup(testConfig, defaultInjected);
    const server = request(app);
    return { app, ioc, server };
  },
  insertUser: async ioc => {
    const userRepo = await ioc.getUserRepo();
    const user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    return userRepo.insert(user);
  },
  insertRootFolder: async (user, ioc) => {
    const fileRepo = await ioc.getFileRepo();
    const folder = {
      userId: user.id,
      name: 'root',
      id: shortId(),
      onedriveStatus: 'exists'
    };
    await fileRepo.upsertFolder(folder);
    return folder;
  }
};
