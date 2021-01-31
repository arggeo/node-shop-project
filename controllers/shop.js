// Classes
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
   const products = Product.fetchAll(products => {
      res.render('shop/product-list', {
         pageTitle: 'All Products',
         prods: products,
         path: '/products'
      });
   });
}

exports.getProduct = (req, res, next) => {
   const prodID = req.params.productID;
   Product.findByID(prodID, product => {
      res.render('shop/product-details', {
         pageTitle: product.title,
         path: '/products',
         product: product
      });
   });
}

exports.getIndex = (req, res, next) => {
   const products = Product.fetchAll(products => {
      res.render('shop/index', {
         pageTitle: 'Shop',
         path: '/',
         prods: products
      });
   });
}

exports.getCart = (req, res, next) => {
   res.render('shop/cart', {
      pageTitle: 'My Cart',
      path: '/cart'
   });
}

exports.getCheckout = (req, res, next) => {
   res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout'
   });
}

exports.getOrders = (req, res, next) => {
   res.render('shop/orders', {
      pageTitle: 'My Orders',
      path: '/orders'
   });
}