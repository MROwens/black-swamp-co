const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('localhost:27017/store');
mongoose.Promise = global.Promise;


const products = [
  new Product({
    imagePath: 'flail.jpg',
    title: 'Flail',
    price: 12
  }),
  new Product({
    imagePath: 'let_me_drown.jpg',
    title: 'Let Me Drown',
    price: 12
  }),
  new Product({
    imagePath: 'back_slash.jpg',
    title: 'Back Slash',
    price: 12
  }),
  new Product({
    imagePath: 'samurai_sunset.jpg',
    title: 'Samurai Sunset',
    price: 12
  }),
  new Product({
    imagePath: 'tuff_as_nails.jpg',
    title: 'Tuff As Nails',
    price: 12
  }),
  new Product({
    imagePath: 'black_swamp_co.jpg',
    title: 'Black Swamp Co.',
    price: 12
  })
];

let done = 0;
for(let entry = 0; entry < products.length; entry++){
  products[entry].save(function(err, result){
    console.log('ran');
    done++;
    if(done === products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
  console.log('exit');
}
