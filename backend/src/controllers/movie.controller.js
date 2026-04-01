const movieService = require('../services/movie.service');

const index = async (req, res, next) => {
  try {
    const result = await movieService.findAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const movie = await movieService.findById(req.params.id);
    res.json({ data: movie });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const movie = await movieService.create(req.body);
    res.status(201).json({ data: movie });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const movie = await movieService.update(req.params.id, req.body);
    res.json({ data: movie });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await movieService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const featured = async (req, res, next) => {
  try {
    const movies = await movieService.getFeatured();
    res.json({ data: movies });
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show, store, update, destroy, featured };
