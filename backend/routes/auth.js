const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

router.post(
    '/signup',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('Please enter a valid email.')
        .custom(async (email) => {
            const user = await User.find(email);
            if (user[0].length > 0) {
                return Promise.reject("Email address already exist");
            }
        })
        .normalizeEmail(),
        body('password').trim().isLength({ min: 5 }),
    ], authController.signup
);

router.post(
    '/login', authController.login
);

router.post(
    '/google-login', authController.googleLogin
);

// router.post('/request-password-reset', authController.requestPasswordReset);
router.post(
    '/reset-password-request', 
    [
        body('email').isEmail().withMessage('Please enter a valid email.')
        .custom(async (email) => {
            const user = await User.find(email);
            if (user[0].length === 0) {
                return Promise.reject("Email address not exist");
            }
        })
    ],
    authController.sendPasswordResetEmail
);

router.post('/reset-password', authController.resetPassword);

// router.post('/change-password', authController.changePassword);

module.exports = router;