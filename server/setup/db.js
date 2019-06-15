'use strict';
const Umzug = require('umzug');

module.exports.init = async ioc => {
  const db = await ioc.getDb();
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize: db
    },
    migrations: {
      params: [
        db.getQueryInterface(),
        db.constructor,
        () => { throw Error('Something went wrong'); }
      ],
      path: './migrations',
      pattern: /\.js$/
    },
    /* eslint-disable no-console */
    logging: console.log
    /* eslint-enable no-console */
  });
  await umzug.up();
};
