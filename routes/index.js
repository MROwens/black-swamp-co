const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  const products = Product.find(function(err, dbItems){
    let productChunks = [];
    const chunkSize = 3;
    for(let product = 0; product < dbItems.length; product += chunkSize){
      productChunks.push(dbItems.slice(product, product + chunkSize));
    }
    res.render('shop/index', { title: 'Shop', products: productChunks });
  });
});

router.get('/user/signup', function(req, res, next){
  const messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});

module.exports = router;
