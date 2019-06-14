'use strict';
const _ = require('lodash');
const fs = require('es6-fs');
const path = require('path');

const testSuffix = 'test.js';
const controllerSuffix = '.js';
const controllerDirectory = path.join(__dirname, 'controller');

module.exports.init = async app => {
  const controllers = await fs.readdir(controllerDirectory);
  const controllerNames = controllers
    .filter(it => it.endsWith(controllerSuffix))
    .filter(it => !it.endsWith(testSuffix))
    .map(it => it.substring(0, it.length - controllerSuffix.length));

  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const controllersWithRoutes = controllerNames
    .map(it => ({ route: it, constructor: require(path.join(controllerDirectory, it)) }))
    .map(({ route, constructor }) => ({ route, instance: new constructor() }));
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require global-require */
  const paths = _.flatten(controllersWithRoutes
    .map(({ route, instance }) => Object.keys(instance.routes).map(it => ({
      url: path.join(`/api/${route}`, it),
      implementations: instance.routes[it]
    }))));
  paths.forEach(({ url, implementations }) => {
    Object.keys(implementations).forEach(method => {
      app[method](url, implementations[method]);
    });
  });
};
