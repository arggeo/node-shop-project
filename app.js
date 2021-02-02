const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

// Database
const sequelize = require('./util/database');

// Models
const Product = require('./models/product');
const User = require('./models/user');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Controllers
const errorController = require('./controllers/error');

// Util

// Templates
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   User.findByPk(1)
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', errorController.get404);

Product.belongsTo(User, {
   constraint: true,
   onDelete: 'CASCADE'
});

User.hasMany(Product);

// sequelize.sync({ force: true })
sequelize.sync()
   .then(result => {
      // console.log(result);
      return User.findByPk(1);
   })
   .then(user => {
      if (!user) {
         return User.create({
            name: 'Argy',
            email: 'test@test.com'
         })
      }
      return Promise.resolve(user);
   })
   .then(user => {
      app.listen(3000);
   })
   .catch(err => {
      console.log(err);
   });