// Models
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
   Product.find()
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
   Product.findById(prodID)
      .then(product => {
         res.render('shop/product-details', {
            pageTitle: product.title,
            path: '/products',
            product: product,
            isAuthenticated: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
   Product.find()
      .then(products => {
         res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            prods: products,
            isAuthenticated: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
   req.user.populate('cart.items.productId')
      .execPopulate()
      .then(user => {
         const products = user.cart.items;
         res.render('shop/cart', {
            pageTitle: 'My Cart',
            path: '/cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
   const prodID = req.body.productID;
   Product.findById(prodID)
      .then(product => {
         return req.user.addToCart(product);
      })
      .then(() => res.status(302).redirect('/cart'))
      .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   req.user.removeFromCart(prodID)
      .then(result => {
         res.status(302).redirect('/cart');
      })
      .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
   req.user.populate('cart.items.productId')
      .execPopulate()
      .then(user => {
         const products = user.cart.items.map(i => {
            return {
               quantity: i.quantity,
               product: { ...i.productId._doc }
            }
         });
         const order = new Order({
            user: {
               name: req.user.name,
               userId: req.user
            },
            products: products
         });
         return order.save();
      })
      .then(() => {
         return req.user.clearCart();
      })
      .then(() => {
         res.status(302).redirect('/orders');
      })
      .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
   Order.find({ 'user.userId': req.user._id })
      .then(orders => {
         res.render('shop/orders', {
            pageTitle: 'My Orders',
            path: '/orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
         });
      })
      .catch(err => console.log(err));
}