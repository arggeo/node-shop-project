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
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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
}); // arguments are optional
// User.hasMany(Product, {
//    constraint: true,
//    onDelete: 'CASCADE'
// });

// A User owns many products (selling, -not bought)
User.hasMany(Product);

// A User has one Cart
User.hasOne(Cart);
Cart.belongsTo(User); // Optional - same effect as previous statement, one direction is enough

// A Cart has many products
Cart.belongsToMany(Product, { through: CartItem });

// A Product can belong to many carts
Product.belongsToMany(Cart, { through: CartItem });

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
      // returning a promise to be consistent with return values in any case however "return user" will suffice
      return Promise.resolve(user);
   })
   .then(user => {
      return user.createCart();
   })
   .then(cart => {
      app.listen(3000);
   })
   .catch(err => {
      console.log(err);
   });