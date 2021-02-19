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

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

// POST
router.post('/cart', isAuth, shopController.postCart);

router.post('/card-delete-item', isAuth, shopController.postCartDeleteProduct);

module.exports = router;