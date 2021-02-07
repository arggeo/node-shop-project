// Database
// const getDB = require('../util/database').getDB;

// Model
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
   const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user // mongoose will automatically pick the user id (req.user._id)
   });
   product.save()
      .then(result => {
         res.status(302).redirect('/admin/products');
      })
      .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
   const editMode = req.query.edit;
   if (!editMode) {
      return res.status(302).redirect('/');
   }
   const prodID = req.params.productID;
   Product.findById(prodID)
      .then(product => {
         if (!product) {
            res.status(302).redirect('/');
         }
         res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
         });
      })
      .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
   const prodID = req.body.productID;
   const updatedTitle = req.body.title;
   const updatedPrice = req.body.price;
   const updatedImageUrl = req.body.imageUrl;
   const updatedDescription = req.body.description;
   Product.findById(prodID)
      .then(product => {
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.description = updatedDescription;
         product.imageUrl = updatedImageUrl;
         return product.save();
      })
      .then(result => {
         res.status(302).redirect('/admin/products');
      })
      .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
   Product.find()
      // .select('title price -_id')  // selects only specific fields to get fetched
      // .populate('userId', 'name')  // populates related fields (refs) | call .execPopulate() to get a promise
      .then(products => {
         res.render('admin/products', {
            pageTitle: 'Admin Products',
            prods: products,
            path: '/admin/products'
         });
      })
      .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
   const prodID = req.body.productID;
   Product.findByIdAndRemove(prodID)
      .then(() => {
         res.status(302).redirect('/admin/products');
      })
      .catch(err => console.log(err));
}