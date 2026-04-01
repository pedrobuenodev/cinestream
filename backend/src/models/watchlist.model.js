const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');
const Movie = require('./movie.model');

const Watchlist = sequelize.define(
  'Watchlist',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'watchlist',
    timestamps: true,
    indexes: [{ unique: true, fields: ['userId', 'movieId'] }],
  }
);

// Associations
Watchlist.belongsTo(User, { foreignKey: 'userId' });
Watchlist.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });
User.hasMany(Watchlist, { foreignKey: 'userId' });

module.exports = Watchlist;
