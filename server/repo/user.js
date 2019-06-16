'use strict';
import { DataTypes } from 'sequelize';

export default class {
  constructor(db) {
    this.UserEntity = db.define('user', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: { type: DataTypes.TEXT, allowNull: false }
    }, {
      timestamps: false,
      freezeTableName: true,
      returning: true
    });
  }

  async get() {
    const users = await this.UserEntity.findAll();
    return JSON.parse(JSON.stringify(users));
  }

  async insert(user) {
    await this.UserEntity.create(user);
  }
}
