// Classes
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
   Product.fetchAll()
      .then(products => {
         res.render('shop/product-list', {
            pageTitle: 'All Products',
            path: '/products',
            prods: products
         });
      })
      .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
   const prodID = req.params.productID;
   Product.findByID(prodID)
      .then(product => {
         res.render('shop/product-details', {
            pageTitle: product.title,
            path: '/products',
            product: product
         });
      })
      .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
   Product.fetchAll()
      .then(products => {
         res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            prods: products
         });
      })
      .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
   req.user.getCart()
      .then(products => {
         res.render('shop/cart', {
            pageTitle: 'My Cart',
            path: '/cart',
            products: products
         });
      })
      .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
   const prodID = req.body.productID;
   Product.findByID(prodID)
      .then(product => {
         return req.user.addToCart(product);
      })
      .then(() => res.status(302).redirect('/cart'))
      .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   req.user.deleteCartItem(prodID)
      .then(result => {
         res.status(302).redirect('/cart');
      })
      .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
   let fetchedCart;
   req.user.addOrder()
      .then(result => {
         res.status(302).redirect('/orders');
      })
      .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
   req.user.getOrders()
      .then(orders => {
         res.render('shop/orders', {
            pageTitle: 'My Orders',
            path: '/orders',
            orders: orders
         });
      })
      .catch(err => console.log(err));
}