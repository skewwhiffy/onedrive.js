'use strict';
import axios from 'axios';
import Sequelize from 'sequelize';
import Logger from '../utils/logger';
import dynamicRequire from '../utils/dynamic.require';

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
  getLogger: async () => new Logger(),
};

const singletonClasses = {
  OnedriveService: '../service/onedrive',
  UserRepo: '../repo/user',
  DeltaRepo: '../repo/delta'
};

Object.keys(singletonClasses).forEach(key => {
  const constructor = dynamicRequire(singletonClasses[key]);
  singletons[`get${key[0].toUpperCase()}${key.substring(1)}`] = ioc => ioc.instantiate(constructor);
});

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

  async instantiate(toInstantiate) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const getParamNames = func => {
      const fnStr = func.toString().replace(STRIP_COMMENTS, '');
      const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      return result === null ? [] : result;
    };

    const paramNames = getParamNames(toInstantiate);
    const paramValues = await Promise.all(paramNames
      .map(it => `get${it[0].toUpperCase()}${it.substring(1)}`)
      .map(it => {
        try {
          return this[it]();
        } catch (_err) {
          console.log(it);
          throw _err;
        }
      }));
    return new toInstantiate(...paramValues);
  }
}

export const init = toInject => {
  Object.keys(singletonCache).forEach(it => delete singletonCache[it]);
  Object.keys(toInject).forEach(key => {
    const getterKey = `get${key[0].toUpperCase()}${key.substring(1)}`;
    singletons[getterKey] = async () => toInject[key];
  });
};
