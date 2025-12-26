const router = require('express').Router();
const reportController = require('../controller/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get/:id', reportController.get);
router.delete('/remove/:id', reportController.remove);

module.exports = router;