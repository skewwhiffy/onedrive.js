'use strict';
const Sequelize = require('sequelize');

const singletons = {
  getDb: async ioc => {
    const config = await ioc.getConfig();
    return new Sequelize({
      dialect: 'sqlite',
      storage: config.db
    });
  }
};

class Container {
  constructor(inject) {
    this.singletonCache = {};
    this.perRequestCache = {};
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

const containerCache = {};

module.exports.init = config => {
  const configKey = JSON.stringify(config);
  containerCache[configKey] = containerCache[configKey] || new Container(config);
  return containerCache[configKey];
};
