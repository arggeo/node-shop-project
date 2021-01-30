const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/admin');

// GET => /admin
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);

// POST => /admin
router.post('/add-product', adminController.postAddProduct);

module.exports = router;