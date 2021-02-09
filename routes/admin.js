const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/admin');

// Middleware
const isAuth = require('../middleware/is-auth');

// GET => /admin
router.get('/add-product', isAuth, adminController.getAddProduct);  // they are read from left to right
router.get('/edit-product/:productID', isAuth, adminController.getEditProduct);
router.get('/products', adminController.getProducts);

// POST => /admin
router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;