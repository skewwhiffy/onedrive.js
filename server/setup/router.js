'use strict';
import express from 'express';
import _ from 'lodash';
import fs from 'es6-fs';
import path from 'path';
import dynamicRequire from '../utils/dynamic.require';

const testSuffix = 'test.js';
const controllerSuffix = '.js';
const controllerDirectory = path.join(__dirname, '../controller');

export default {
  init: async ioc => {
    const app = await ioc.getApp();
    const logger = await ioc.getLogger();
    const controllers = await fs.readdir(controllerDirectory);
    const controllerNames = controllers
      .filter(it => it.endsWith(controllerSuffix))
      .filter(it => !it.endsWith(testSuffix))
      .map(it => it.substring(0, it.length - controllerSuffix.length));

    const controllersWithRoutes = controllerNames
      .map(controllerName => {
        const controllerFile = path.join(controllerDirectory, controllerName);
        try {
          const constructor = dynamicRequire(controllerFile);
          const instance = new constructor();
          const route = instance.baseRoute || controllerName;
          return { route, instance };
        } catch (err) {
          logger.error(`Could not instantiate controller ${controllerName}`);
          throw err;
        }
      });
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
    app.get('/', async (req, res) => {
      const { query } = req;
      if (query && query.code) {
        res.redirect(`/api/user/code/${query.code}`);
      } else {
        const file = await fs.readFile('resources/index.html');
        res.send(file.toString());
      }
    });
    app.use(express.static('resources'));
  }
};
