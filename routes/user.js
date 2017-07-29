const express = require('express');
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart')
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);
//user profile
router.get('/profile', isLoggedIn, function(req, res, next){//only available to logged in users
  Order.find({user: req.user}, function(err, orders){//req user provided by passport
    if(err){
      return res.write('Error');
    }
    let cart;
    orders.forEach(function(order){//looping through user orders
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders});
  });
});
//user logout
router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();//passport
  res.redirect('/');
});


router.use('/', notLoggedIn, function(req, res, next){//non logged in available routes
  next();
});
//user signup page
router.get('/signup', function(req, res, next){
  const messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
//sign in user
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',//passport
  failureRedirect: '/user/signup',
  failureFlash: true
}));
//sign in page
router.get('/signin', function(req, res, next){
  const messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
//sign in user
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


module.exports = router;
//is user logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){//passport
    return next();
  }
  res.redirect('/');
}
//is user logged in
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){//passport
    return next();
  }
  res.redirect('/');
}
