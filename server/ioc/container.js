'use strict';
import Sequelize from 'sequelize';
import Logger from '../utils/logger';

const singletons = {
  getDb: async ioc => {
    const config = await ioc.getConfig();
    return new Sequelize({
      dialect: 'sqlite',
      storage: config.db,
      logging: false
    });
  },
  getLogger: async () => new Logger()
};

export default class {
  constructor(inject) {
    this.singletonCache = {};
    Object.keys(singletons).forEach(key => {
      this[key] = async () => {
        this.singletonCache[key] = this.singletonCache[key] || await singletons[key](this);
        return this.singletonCache[key];
      };
    });
    Object.keys(inject).forEach(key => {
      const method = `get${key[0].toUpperCase()}${key.substring(1)}`;
      this[method] = async () => inject[key];
    });
  }
}
