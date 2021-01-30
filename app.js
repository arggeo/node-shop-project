const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

// Routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Util

// Templates
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);
router.get('/', (req, res, next) => {
   res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);