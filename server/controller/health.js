'use strict';

export default class {
  constructor() {
    this.routes = {
      '/': {
        get: this.get
      }
    };
  }

  async get(req, res) {
    const db = await req.ioc.getDb();
    const dbVersionData = await db.query('select sqlite_version() version');
    res.send({
      db: {
        status: 'OK',
        version: dbVersionData[0][0].version
      }
    });
  }
}
