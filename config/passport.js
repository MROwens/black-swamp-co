const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
//passport configurations
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});
//passport strategy for user signup
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Password must be at least 6 characters').notEmpty().isLength({min:6});
  const errors = req.validationErrors();
  if(errors){
    const messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function(err, user){
    if(err){
      return done(err);
    }
    if(user){
      return  done(null, false, {message: 'That email already exists.'});
    }
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result){
      if(err){
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));
//passport strategy for user signin
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Enter password').notEmpty();
  const errors = req.validationErrors();
  if(errors){
    const messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function(err, user){
    if(err){
      return done(err);
    }
    if(!user){
      return  done(null, false, {message: 'User not found'});
    }
    if(!user.validPassword(password)){
      return  done(null, false, {message: 'Incorrect password'});
    }
    return done(null, user);
  });
}));
