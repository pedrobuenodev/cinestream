const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar_url: { type: DataTypes.TEXT, defaultValue: null },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  },
  {
    tableName: 'users',
    timestamps: true,
    // Never return password in JSON
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { attributes: {} },
    },
  }
);

module.exports = User;
