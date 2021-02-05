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
      .then(cart => {
         return cart.getProducts()
            .then(products => {
               res.render('shop/cart', {
                  pageTitle: 'My Cart',
                  path: '/cart',
                  products: products
               });
            })
            .catch(err => console.log(err));
      })
      .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
   const prodID = req.body.productID;
   let fetchedCart;
   let newQuantity = 1;
   req.user.getCart()
      .then(cart => {
         fetchedCart = cart;
         return cart.getProducts({ where: { id: prodID }})
      })
      .then(products => {
         let product;
         if (products.length > 0) {
            product = products[0];
         }
         if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
         }
         return Product.findByPk(prodID);
      })
      .then(product => {
         return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
         });
      })
      .then(() => {
         res.status(302).redirect('/cart');
      })
      .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   req.user.getCart()
      .then(cart => {
         return cart.getProducts({ where: { id: prodID } });
      })
      .then(products => {
         const product = products[0];
         return product.cartItem.destroy();
      })
      .then(result => {
         res.status(302).redirect('/cart');
      })
      .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
   let fetchedCart;
   req.user.getCart()
      .then(cart => {
         fetchedCart = cart;
         return cart.getProducts();
      })
      .then(products => {
         return req.user.createOrder()
            .then(order => {
               return order.addProducts(products.map(product => {
                  product.orderItem = { quantity: product.cartItem.quantity }
                  return product;
               }));
            })
            .catch(err => console.log(err));
      })
      .then(result => {
         return fetchedCart.setProducts(null);
      })
      .then(result => {
         res.status(302).redirect('/orders');
      })
      .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
   req.user.getOrders({ include: ['products'] })
      .then(orders => {
         res.render('shop/orders', {
            pageTitle: 'My Orders',
            path: '/orders',
            orders: orders
         });
      })
      .catch(err => console.log(err));
}