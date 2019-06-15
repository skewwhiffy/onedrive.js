'use strict';
const Sequelize = require('sequelize');

const singletons = {
  getDb: async config => new Sequelize({
    dialect: 'sqlite',
    storage: config.db
  })
};

class Container {
  constructor(config) {
    this.config = config;
    this.singletonCache = {};
    this.perRequestCache = {};
    Object.keys(singletons).forEach(key => {
      this[key] = async () => {
        this.singletonCache[key] = this.singletonCache[key] || await singletons[key](config);
        return this.singletonCache[key];
      };
    });
  }
}

const containerCache = {};

module.exports.init = config => {
  const configKey = JSON.stringify(config);
  containerCache[configKey] = containerCache[configKey] || new Container(config);
  return containerCache[configKey];
};
