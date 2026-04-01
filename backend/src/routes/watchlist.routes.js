const { Router } = require('express');
const controller = require('../controllers/watchlist.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

// All watchlist routes require authentication
router.use(authenticate);

router.get('/', controller.index);
router.get('/:movieId/check', controller.check);
router.post('/:movieId', controller.store);
router.delete('/:movieId', controller.destroy);

module.exports = router;
