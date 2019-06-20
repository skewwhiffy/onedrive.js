'use strict';

export default {
  up: async (query, DataTypes) => {
    await query.createTable('folder', {
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
      parentFolderId: { type: DataTypes.INTEGER, allowNull: true }
    });
  }
};
