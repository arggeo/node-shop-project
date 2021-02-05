const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

// Database
const mongoConnect = require('./util/database').mongoConnect;

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Controllers
const errorController = require('./controllers/error');

// Models
const User = require('./models/user');

// Util

// Templates
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   User.findByID('601dcae60da2f928f7751f53')
      .then(user => {
         req.user = user;
      })
      .catch(err => console.log(err));
   next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', errorController.get404); // '/' is optional

mongoConnect(() => {
   app.listen(3000);
});