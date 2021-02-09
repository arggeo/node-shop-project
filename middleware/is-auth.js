module.exports = (req, res, next) => {
   if (!req.session.isLoggedIn) {
      return res.status(302).redirect('/login');
   }
   next();
}