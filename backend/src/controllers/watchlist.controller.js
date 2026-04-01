const watchlistService = require('../services/watchlist.service');

const index = async (req, res, next) => {
  try {
    const movies = await watchlistService.getByUser(req.user.id);
    res.json({ data: movies });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    await watchlistService.add(req.user.id, req.params.movieId);
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await watchlistService.remove(req.user.id, req.params.movieId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const check = async (req, res, next) => {
  try {
    const inList = await watchlistService.isInWatchlist(req.user.id, req.params.movieId);
    res.json({ inWatchlist: inList });
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, destroy, check };
