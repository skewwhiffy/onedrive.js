'use strict';

export default {
  up: async (query, DataTypes) => {
    await query.createTable('syncStatus', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        unique: true,
        allowNull: false
      },
      status: { type: DataTypes.STRING, allowNull: false },
      nextLink: { type: DataTypes.STRING, allowNull: true }
    });
  }
};
