'use strict';

export default class {
  constructor(entities) {
    this.entities = entities;
  }

  async get() {
    const users = await this.entities.User.findAll();
    return JSON.parse(JSON.stringify(users));
  }

  async insert(user) {
    const inserted = await this.entities.User.create(user);
    return JSON.parse(JSON.stringify(inserted));
  }
}
