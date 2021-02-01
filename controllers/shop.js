// Classes
const Product = require('../models/product');
const Cart = require('../models/cart');

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
   Cart.getCart(cart => {
      Product.fetchAll(products => {
         const cartProducts = [];
         for (product of products) {
            const cartProductData = cart.products.find(prod => prod.id === product.id);
            if (cartProductData) {
               cartProducts.push({ productData: product, qty: cartProductData.qty });
            }
         }
         res.render('shop/cart', {
            pageTitle: 'My Cart',
            path: '/cart',
            products: cartProducts
         });
      });
   });
}

exports.postCart = (req, res, next) => {
   const prodID = req.body.productID;
   Product.findByID(prodID, product => {
      Cart.addProduct(prodID, product.price);
   });
   res.status(302).redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   Product.findByID(prodID, product => {
      Cart.deleteProduct(prodID, product.price);
      res.status(302).redirect('/cart');
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