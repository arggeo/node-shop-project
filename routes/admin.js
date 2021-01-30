const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res, next) => {
   res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product'
   });
});

const products = [];
router.post('/add-product', (req, res, next) => {
   products.push({ title: req.body.title });
   console.log(products);
   res.status(302).redirect('/');
});

exports.router = router;
exports.products = products;