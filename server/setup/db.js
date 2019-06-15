'use strict';
import Umzug from 'umzug';

export default {
  init: async ioc => {
    const db = await ioc.getDb();
    const logger = await ioc.getLogger();
    const logging = logger.info;
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
      logging
    });
    await umzug.up();
  }
};
