'use strict';
import axios from 'axios';
import Sequelize from 'sequelize';
import Logger from '../utils/logger';
import OnedriveService from '../service/onedrive';
import UserRepo from '../repo/user';

const singletons = {
  getAxios: async () => axios,
  getDb: async ioc => {
    const config = await ioc.getConfig();
    return new Sequelize({
      dialect: 'sqlite',
      storage: config.db,
      logging: false
    });
  },
  getOnedriveService: async ioc => new OnedriveService(
    await ioc.getAxios(),
    await ioc.getLogger()
  ),
  getUserRepo: async ioc => new UserRepo(await ioc.getDb()),
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

export const init = toInject => {
  Object.keys(singletonCache).forEach(it => delete singletonCache[it]);
  Object.keys(toInject).forEach(key => {
    const getterKey = `get${key[0].toUpperCase()}${key.substring(1)}`;
    singletons[getterKey] = async () => toInject[key];
  });
};
