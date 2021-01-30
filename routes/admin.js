const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res, next) => {
   res.render('add-product', { pageTitle: 'Add Product' });
});

const products = [];
router.post('/add-product', (req, res, next) => {
   products.push({ title: res.body.title });
   console.log(products);
   res.status(302).redirect('/');
});

exports.router = router;