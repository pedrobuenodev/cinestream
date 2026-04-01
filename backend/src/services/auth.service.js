const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async ({ name, email, password }) => {
  const existing = await User.scope('withPassword').findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user.toJSON();

  return { user: safeUser, token };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { register, login, getProfile };
