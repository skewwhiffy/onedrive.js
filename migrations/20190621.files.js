'use strict';

export default {
  up: async (query, DataTypes) => {
    await query.createTable('file', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
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
};
