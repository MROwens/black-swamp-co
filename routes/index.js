const express = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');
const stripe = require("stripe")("sk_test_RUZ8p3YSy0CssqkFy9r7zkI3");
const router = express.Router();


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

router.get('/add-to-cart/:id', function(req, res, next){
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err){
      res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// router.get('/checkout', function(req, res, next){
//   if(!req.session.cart){
//     return res.redirect('/shopping-cart');
//   }
//   const cart = new Cart(req.session.cart);
//   res.render('shop/checkout', {total: cart.totalPrice});
// });

router.post('/pay', function(req, res, next){
  if(!req.session.cart){
    return res.redirect('shopping-cart');
  }

  const cart = new Cart(req.session.cart);

  const token = req.body.stripeToken;
  console.log(req.body);

  // Charge the user's card
  const charge = stripe.charges.create({
   amount: req.session.cart.totalPrice * 100,
   currency: "usd",
   description: "Example charge",
   source: token,
  }, function(err, charge) {
    if(err){
      return err;
    }
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;
