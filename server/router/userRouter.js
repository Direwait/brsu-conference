const router = require('express').Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 255}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.put('/update/:id',
    authMiddleware,
    body('changes[email]').optional().isEmail(),
    body('changes[password]').optional().isLength({ min: 8, max: 255 }),
    userController.update
);
router.post('/reset-code',
    body('email').isEmail(),
    userController.sendCode
); 
router.post('/reset-pass',
    body('password').isLength({ min: 8, max: 255 }),
    userController.resetPassword
);
router.delete('/remove/:id', authMiddleware, userController.remove);
router.get('/get', userController.getUsers);

module.exports = router;