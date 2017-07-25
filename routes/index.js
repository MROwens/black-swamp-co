const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const csrf = require('csurf');

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
  res.render('user/signup', {csrfToken: req.csrfToken()})
});

router.post('/user/signup', function(req, res, next){
  res.redirect('/');
});

module.exports = router;
