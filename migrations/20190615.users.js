'use strict';

export default {
  up: async (query, DataTypes) => {
    await query.createTable('user', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      onedriveId: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      displayName: { type: DataTypes.TEXT, allowNull: false },
      refreshToken: { type: DataTypes.TEXT, allowNull: false }
    });
  }
};
