const Category = require('../models/category.model');

const index = async (_req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show };
