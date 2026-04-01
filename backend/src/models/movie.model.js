const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./category.model');

const Movie = sequelize.define(
  'Movie',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    duration: { type: DataTypes.INTEGER, comment: 'Duration in minutes' },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    poster_url: { type: DataTypes.TEXT },
    backdrop_url: { type: DataTypes.TEXT },
    trailer_url: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM('movie', 'series'), defaultValue: 'movie' },
    categoryId: { type: DataTypes.INTEGER, references: { model: 'categories', key: 'id' } },
  },
  { tableName: 'movies', timestamps: true }
);

// Associations
Movie.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Movie, { foreignKey: 'categoryId', as: 'movies' });

module.exports = Movie;
