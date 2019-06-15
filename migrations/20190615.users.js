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
      email: { type: DataTypes.TEXT, allowNull: false }
    });
  }
};
