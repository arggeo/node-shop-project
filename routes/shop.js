const express = require('express');
const router = express.Router();

// Controllers
const shopController = require('../controllers/shop');

// GET
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productID', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

// POST
router.post('/cart', shopController.postCart);

router.post('/card-delete-item', shopController.postCartDeleteProduct);

module.exports = router;