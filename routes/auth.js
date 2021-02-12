const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth');

// GET => /login
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

// POST => /login
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;