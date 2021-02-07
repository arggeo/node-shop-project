const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

// Database
const mongoose = require('mongoose');

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
   User.findById('601fad3b2c244505ccdfe78a')
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', errorController.get404); // '/' is optional

mongoose.connect('mongodb+srv://argy:myS3cuReP4ssW0rd@cluster0.elrli.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
   User.findOne()
      .then(user => {
         if (!user) {
            const user = new User({
               name: 'Argy',
               email: 'argy@test.com',
               cart: {
                  items: []
               }
            });
            user.save();
         }
      });
   app.listen(3000);
})
   .catch(err => console.log(err));