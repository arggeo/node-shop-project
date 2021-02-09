const express = require('express');
const router = express.Router();

// Controllers
const shopController = require('../controllers/shop');

// Middleware
const isAuth = require('../middleware/is-auth');

// GET
router.get('/', shopController.getIndex);

router.get('/cart', isAuth, shopController.getCart);

router.get('/products', shopController.getProducts);

router.get('/products/:productID', shopController.getProduct);

router.get('/orders', isAuth, shopController.getOrders);

// POST
router.post('/cart', isAuth, shopController.postCart);

router.post('/card-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;