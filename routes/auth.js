const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth');

// GET => /login
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

// POST => /login
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);

module.exports = router;