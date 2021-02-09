const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   // const isLoggedIn = req.get('Cookie').split(';')[4].trim().split('=')[1] === 'true';
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false
   });
}

exports.postLogin = (req, res, next) => {
   // res.setHeader('Set-Cookie', 'loggedIn=true'); // Expires, Max-Age, Domain, Secure, HttpOnly
   User.findById('601fad3b2c244505ccdfe78a')
      .then(user => {
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.session.save(err => {
            console.log(err);
            res.status(302).redirect('/');
         }); // session.save() is not always needed - here, ensures that session has been saved before redirecting

      })
      .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.status(302).redirect('/');
   });
}