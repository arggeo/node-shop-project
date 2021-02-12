const express = require('express');
const router = express.Router();

// Models
const User = require('../models/user');

// Validator
const { check, body } = require('express-validator/check');

// Controllers
const authController = require('../controllers/auth');

// GET => /login
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

// POST => /login
router.post(
   '/login',
   [
      body('email')
         .isEmail()
         .withMessage('Please enter a valid email.'),
      body(
         'password',
         'Please enter a password with only numbers and text and at least 5 characters.'
         )
         .isLength({ min: 5 })
         .isAlphanumeric()
   ],
   authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
   '/signup',
   [
      check('email')
         .isEmail()
         .withMessage('Please enter a valid email.')
         .custom((value, {req}) => {
            // if (value === 'test@test.com') {
            //    throw new Error('This email address if forbidden.');
            // }
            // return true;
            return User.findOne({ email: value })
               .then(userDoc => {
                  if (userDoc) {
                     return Promise.reject('E-mail already exists, please pick a different one.');
                  }
               });
         }),
      body(
         'password',
         'Please enter a password with only numbers and text and at least 5 characters.'
         )
         .isLength({ min: 5 })
         .isAlphanumeric(),
      body('confirmPassword')
         .custom((value, { req }) => {
         if (value === req.body.password) {
            throw new Error('Passwords do not match!');
         }
         return true;
      })
   ],
   authController.postSignup
);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;