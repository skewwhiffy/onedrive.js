'use strict';
import { DataTypes } from 'sequelize';

export default class {
  constructor(db) {
    const options = {
      timestamps: false,
      freezeTableName: true,
      returning: true
    };
    this.User = db.define('user', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      onedriveId: { type: DataTypes.TEXT, allowNull: false }, // TODO: Unique
      displayName: { type: DataTypes.TEXT, allowNull: false },
      refreshToken: { type: DataTypes.TEXT, allowNull: false }
    }, options);

    this.DeltaNext = db.define('deltaNext', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: this.User,
        unique: true,
        allowNull: false
      },
      nextLink: { type: DataTypes.STRING, allowNull: false }
    }, options);

    this.Folder = db.define('folder', {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: this.User,
        allowNull: false
      },
      name: { type: DataTypes.TEXT, allowNull: false },
      parentFolderId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'folder',
          key: 'id'
        }
      }
    }, options);

    this.File = db.define('file', {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: this.UserEntity },
        allowNull: false
      },
      name: { type: DataTypes.TEXT, allowNull: false },
      parentFolderId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: this.Folder
      },
      onedriveStatus: { type: DataTypes.STRING, allowNull: false }
    }, options);
  }
}
