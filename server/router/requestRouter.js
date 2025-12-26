const router = require('express').Router();
const requestController = require('../controller/requestController');
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-personal/:id', requestController.getPersonal);
router.get('/get/:id', requestController.getOne);
router.post('/insert', requestController.insert);
// router.put('/update/:id', requestController.update);
router.delete('/remove/:id', requestController.remove);

router.get('/get-all', authMiddleware, adminMiddleware, requestController.getAll);
router.post('/console', requestController.execute);
router.put('/response/:id', requestController.response);

module.exports = router;