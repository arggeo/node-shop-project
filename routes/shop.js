const express = require('express');
const router = express.Router();

// Routes
const adminData = require('../routes/admin');

router.get('/', (req, res, next) => {
   res.render('shop', {
      pageTitle: 'Shop',
      prods: adminData.products,
      path: '/'
   });
});

module.exports = router;