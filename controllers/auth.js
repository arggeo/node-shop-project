const User = require('../models/user');

// Validator
const { validationResult } = require('express-validator/check');

// Encryption
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Mailer
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
    api_key: 'xxxxxxxxx'
   }
}));

exports.getLogin = (req, res, next) => {
   // const isLoggedIn = req.get('Cookie').split(';')[4].trim().split('=')[1] === 'true';
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message
   });
}

exports.postLogin = (req, res, next) => {
   // res.setHeader('Set-Cookie', 'loggedIn=true'); // Expires, Max-Age, Domain, Secure, HttpOnly
   const email = req.body.email;
   const password = req.body.password;

   const errors = validationResult(req);
   if (!errors.isEmpty()){
      return res.render('auth/login', {
         path: '/login',
         pageTitle: 'Login',
         errorMessage: errors.array()[0].msg
      });
   }

   User.findOne({ email: email })
      .then(user => {
         if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.status(302).redirect('/login');
         }
         bcrypt.compare(password, user.password)
            .then(doMatch => {
               if (doMatch) {
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  return req.session.save(err => {
                     console.log(err);
                     res.status(302).redirect('/');
                  }); // session.save() is not always needed - here, ensures that session has been saved before redirecting
               }
               req.flash('error', 'Invalid email or password.');
               res.status(302).redirect('/login');
            })
            .catch(err => {
               console.log(err);
               res.status(302).redirect('/');
            });
      })
      .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.status(302).redirect('/');
   });
}

exports.getSignup = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
   });
}

exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
         path: '/signup',
         pageTitle: 'Signup',
         errorMessage: errors.array()[0].msg
      });
   }

   bcrypt.hash(password, 12)
      .then(hashedPassword => {
         const user = new User({
            email: email,
            password: hashedPassword,
            cart: {
               items: []
            }
         });
         return user.save();
      })
      .then(result => {
         res.status(302).redirect('/login');
         return transporter.sendMail({
            to: email,
            from: 'xxxxxxxxx@gmail.com',
            subject: 'Signup Succeeded',
            html: '<h1>You successfully signed up</h1>'
         })
            .catch(err => console.log(err));
      });
}

exports.getReset = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message
   });
}

exports.postReset = (req, res, next) => {
   crypto.randomBytes(32, (err, buffer) => {
      if (err) {
         console.log(err);
         return res.status(302).redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
         .then(user => {
            if (!user) {
               req.flash('error', 'No account with that email found.');
               return res.status(302).redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
         })
         .then(result => {
            res.status(302).redirect('/');
            transporter.sendMail({
               to: req.body.email,
               from: 'xxxxxxxxx@gmail.com',
               subject: 'Password reset',
               html: `
                  <p>You requested a password reset.</p>
                  <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
               `
            });
         })
         .catch(err => console.log(err));
   });
}

exports.getNewPassword = (req, res, next) => {
   const token = req.params.token;
   User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
         let message = req.flash('error');
         if (message.length > 0) {
            message = message[0];
         } else {
            message = null;
         }
         res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
         });
      })
      .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
   const newPassword = req.body.password;
   const userId = req.body.userId;
   const passwordToken = req.body.passwordToken;
   let resetUser;

   User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {
         $gt: Date.now()
      },
      _id: userId
   })
      .then(user => {
         resetUser = user;
         return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
         resetUser.password = hashedPassword;
         resetUser.resetToken = null;
         resetUser.resetTokenExpiration = undefined;
         return resetUser.save();
      })
      .then(result => {
         res.status(302).redirect('/login');
      })
      .catch(err => console.log(err));
}