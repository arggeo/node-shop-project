const express = require('express');
const router = express.Router();

// Util
const rootDir = require('./util/path');

router.get('/', (req, res, next) => {
   res.render('shop', { pageTitle: 'Shop' });
});

module.exports = router;