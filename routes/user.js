const express = require('express');
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart')
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next){
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return res.write('Error');
    }
    let cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders});
  });
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});


router.use('/', notLoggedIn, function(req, res, next){
  next();
});

router.get('/signup', function(req, res, next){
  const messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next){
  const messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
