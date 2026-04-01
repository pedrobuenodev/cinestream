const errorHandler = (err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  // Sequelize validation
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => e.message);
    return res.status(422).json({ error: 'Validation failed', details: errors });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Default 500
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(statusCode).json({ error: message });
};

module.exports = { errorHandler };
