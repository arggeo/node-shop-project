// Classes
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
   res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
   });
}

exports.postAddProduct = (req, res, next) => {
   const title = req.body.title;
   const imageUrl = req.body.imageUrl;
   const price = req.body.price;
   const description = req.body.description;
   const product = new Product(null, title, imageUrl, description, price);
   product.save();
   res.status(302).redirect('/');
}

exports.getEditProduct = (req, res, next) => {
   const editMode = req.query.edit;
   if (!editMode) {
      return res.status(302).redirect('/');
   }
   const prodID = req.params.productID;
   Product.findByID(prodID, product => {
      if (!prodID) {
         res.status(302).redirect('/');
      }
      res.render('admin/edit-product', {
         pageTitle: 'Edit Product',
         path: '/admin/edit-product',
         editing: editMode,
         product: product
      });
   });
}

exports.postEditProduct = (req, res, next) => {
   const prodID = req.body.productID;
   const updatedTitle = req.body.title;
   const updatedPrice = req.body.price;
   const updatedImageUrl = req.body.imageUrl;
   const updatedDescription = req.body.description;
   const updatedProduct = new Product(prodID, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
   updatedProduct.save();
   res.status(302).redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
   const products = Product.fetchAll(products => {
      res.render('admin/products', {
         pageTitle: 'Admin Products',
         prods: products,
         path: '/admin/products'
      });
   });
}

exports.postDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   Product.deleteByID(prodID);
   res.status(302).redirect('/admin/products');
}