const { Router } = require('express');
const Joi = require('joi');
const controller = require('../controllers/movie.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = Router();

const movieSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(10).required(),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 2).required(),
  duration: Joi.number().integer().min(1).optional(),
  rating: Joi.number().min(0).max(10).optional(),
  poster_url: Joi.string().uri().optional().allow(''),
  backdrop_url: Joi.string().uri().optional().allow(''),
  trailer_url: Joi.string().uri().optional().allow(''),
  type: Joi.string().valid('movie', 'series').required(),
  categoryId: Joi.number().integer().optional(),
});

const updateSchema = movieSchema.fork(
  ['title', 'description', 'year', 'type'],
  (field) => field.optional()
);

// Public routes
router.get('/', controller.index);
router.get('/featured', controller.featured);
router.get('/:id', controller.show);

// Admin-only routes
router.post('/', authenticate, requireAdmin, validate(movieSchema), controller.store);
router.put('/:id', authenticate, requireAdmin, validate(updateSchema), controller.update);
router.delete('/:id', authenticate, requireAdmin, controller.destroy);

module.exports = router;
