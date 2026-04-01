const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return res.status(422).json({ error: 'Validation failed', details: errors });
  }

  next();
};

module.exports = { validate };
