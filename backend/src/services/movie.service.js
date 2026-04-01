const { Op } = require('sequelize');
const Movie = require('../models/movie.model');
const Category = require('../models/category.model');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const findAll = async ({ page = 1, limit = DEFAULT_LIMIT, category, type, search } = {}) => {
  const safePage = Math.max(1, parseInt(page));
  const safeLimit = Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = (safePage - 1) * safeLimit;

  const where = {};

  if (type) where.type = type;
  if (category) where.categoryId = category;
  if (search) {
    where.title = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Movie.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    limit: safeLimit,
    offset,
    order: [['rating', 'DESC']],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(count / safeLimit),
    },
  };
};

const findById = async (id) => {
  const movie = await Movie.findByPk(id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  });

  if (!movie) {
    const err = new Error('Movie not found');
    err.statusCode = 404;
    throw err;
  }

  return movie;
};

const create = async (data) => {
  return Movie.create(data);
};

const update = async (id, data) => {
  const movie = await findById(id);
  return movie.update(data);
};

const remove = async (id) => {
  const movie = await findById(id);
  await movie.destroy();
};

const getFeatured = async () => {
  return Movie.findAll({
    where: { rating: { [Op.gte]: 8.5 } },
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    limit: 10,
    order: [['rating', 'DESC']],
  });
};

module.exports = { findAll, findById, create, update, remove, getFeatured };
