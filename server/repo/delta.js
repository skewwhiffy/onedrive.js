'use strict';
import { DataTypes } from 'sequelize';

export default class {
  constructor(db) {
    this.db = db;
    this.DeltaEntity = db.define('folder', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        allowNull: false
      },
      name: { type: DataTypes.TEXT, allowNull: false },
      parentFolderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'folder',
          key: 'id'
        }
      }
    });
  }

  async process({ user, delta }) {
    const items = delta.value;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.folder) {
        console.log('TODO: folder ' + item.name);
      } else {
        console.log('TODO: file ' + item.name);
      }
    }
  }
}
