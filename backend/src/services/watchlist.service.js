const Watchlist = require('../models/watchlist.model');
const Movie = require('../models/movie.model');
const Category = require('../models/category.model');

const getByUser = async (userId) => {
  const items = await Watchlist.findAll({
    where: { userId },
    include: [
      {
        model: Movie,
        as: 'movie',
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return items.map((item) => item.movie);
};

const add = async (userId, movieId) => {
  const [item, created] = await Watchlist.findOrCreate({
    where: { userId, movieId },
  });

  if (!created) {
    const err = new Error('Already in watchlist');
    err.statusCode = 409;
    throw err;
  }

  return item;
};

const remove = async (userId, movieId) => {
  const deleted = await Watchlist.destroy({ where: { userId, movieId } });

  if (!deleted) {
    const err = new Error('Item not found in watchlist');
    err.statusCode = 404;
    throw err;
  }
};

const isInWatchlist = async (userId, movieId) => {
  const item = await Watchlist.findOne({ where: { userId, movieId } });
  return !!item;
};

module.exports = { getByUser, add, remove, isInWatchlist };
