'use strict';
import Sequelize from 'sequelize';
import Logger from '../utils/logger';
import OnedriveService from '../service/onedrive';
import UserRepo from '../repo/user';

const singletons = {
  getDb: async ioc => {
    const config = await ioc.getConfig();
    return new Sequelize({
      dialect: 'sqlite',
      storage: config.db,
      logging: false
    });
  },
  getOnedriveService: async ioc => new OnedriveService(await ioc.getLogger()),
  getUserRepo: async ioc => {
    const db = await ioc.getDb();
    return new UserRepo(db);
  },
  getLogger: async () => new Logger()
};

const singletonCache = {};

export default class {
  constructor() {
    if (!singletons.getApp) throw Error('Need app injected');
    if (!singletons.getConfig) throw Error('Need config injected');
    Object.keys(singletons).forEach(key => {
      this[key] = async () => {
        singletonCache[key] = singletonCache[key] || await singletons[key](this);
        return singletonCache[key];
      };
    });
    Object.keys(singletonCache).forEach(key => { this[key] = async () => singletonCache[key]; });
  }
}

export const init = ({ app, config, logger }) => {
  Object.keys(singletonCache).forEach(it => delete singletonCache[it]);
  singletons.getApp = async () => app;
  singletons.getConfig = async () => config;
  singletons.getLogger = async () => logger;
};
