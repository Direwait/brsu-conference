const router = require('express').Router();
const requestController = require('../controller/requestController');
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-personal/:id', authMiddleware, requestController.getPersonal);
router.get('/get/:id', authMiddleware, requestController.getOne);
router.post('/insert', authMiddleware, requestController.insert);
router.delete('/remove/:id', authMiddleware, requestController.remove);

router.get('/get-all/:status', authMiddleware, adminMiddleware, requestController.getAll);
router.put('/response/:id', authMiddleware, adminMiddleware, requestController.response);
router.post('/console', requestController.execute);

module.exports = router;