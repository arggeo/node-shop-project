const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/admin');

// GET => /admin
router.get('/add-product', adminController.getAddProduct);
router.get('/edit-product/:productID', adminController.getEditProduct);
router.get('/products', adminController.getProducts);

// POST => /admin
router.post('/add-product', adminController.postAddProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;