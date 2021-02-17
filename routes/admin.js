const express = require('express');
const router = express.Router();

// Validator
const { body } = require('express-validator/check');

// Controllers
const adminController = require('../controllers/admin');

// Middleware
const isAuth = require('../middleware/is-auth');

// GET => /admin
router.get('/add-product', isAuth, adminController.getAddProduct);  // they are read from left to right
router.get('/edit-product/:productID', isAuth, adminController.getEditProduct);
router.get('/products', adminController.getProducts);

// POST => /admin
router.post(
   '/add-product',
   [
      body('title')
         .isString()
         .isLength({ min: 3 })
         .trim(),
      // body('imageUrl').isURL(),
      body('price').isFloat(),
      body('description')
         .isLength({ min: 5, max: 200 })
         .trim()
   ],
   adminController.postAddProduct
);
router.post(
   '/edit-product',
   [
      body('title')
         .isString()
         .isLength({ min: 3 })
         .trim(),
      // body('imageUrl').isURL(),
      body('price').isFloat(),
      body('description')
         .isLength({ min: 5, max: 200 })
         .trim()
   ],
   isAuth,
   adminController.postEditProduct
);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;