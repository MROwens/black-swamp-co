const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();

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

});

module.exports = router;
