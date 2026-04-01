const { Router } = require('express');
const controller = require('../controllers/category.controller');

const router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
