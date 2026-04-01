const { Router } = require('express');
const Joi = require('joi');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', authenticate, controller.me);

module.exports = router;
