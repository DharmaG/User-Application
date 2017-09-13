const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/user-model.js');

const router = express.Router();

router.get('/signup', (req, res, next) => {
  //redirect to home if you are already logged in
  // (and therefore already signed up)
  if(req.user) {
    res.redirect('/');
    return;
  }
  res.render('auth-views/signup-form.ejs');
});

router.post('/process-signup', (req, res, next) => {
  //if either email or password are blank
  if(req.body.signupEmail === "" || req.body.signupPassword === "") {
    res.locals.feedbackkMessage = "We need both email and password.";
    res.render('auth-views/signup-form.ejs');
    return;
  }

 // check the Db to see if there's a user with that email
  UserModel.findOne(
    { email: req.body.signupEmail },

    (err, userFromDb) => {
      if(err){
        next(err);
        return;
      }

      //"userFromDb" will be "null" if we didn't find anything

      // is this email taken
      // it is if we found a user
      if(userFromDb){
        res.locals.feedbackkMessage = "Email taken.";
        res.render('auth-views/signup-form.ejs');
        return;
      }
      // if we get to this line, we have the green light to save!

      //encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const scrambledPass= bcrypt.hashSync(req.body.signupPassword, salt);

      //save the user
      const theUser = new UserModel({
        email: req.body.signupEmail,
        encryptedPassword: scrambledPass
      });

      theUser.save((err) => {
        if(err) {
          next(err);
          return;
        }
        req.flash('signupSucces', 'Sign up sccesful! Try logging in.');
        res.redirect('/');
      });
    }
  );
});


router.get('/login', (req, res, next) => {
    //redirect to home if you are already logged in
  if(req.user) {
    res.redirect('/');
    return;
  }
  //check for feedback messages from the log in process
  res.locals.flashError = req.flash('error');

  // check for feedback messages from the log out process
  res.locals.logoutFeedback = req.flash('logoutSuccess');


  res.locals.securityFeedback = req.flash('securityError');

  res.render('auth-views/login-form.ejs');
});

router.post('/process-login',
  //      name of the strategy   settings object
  //                       |     |
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res, next) => {
    // special passport method for clearing the session
    // (emptying the bowl)
    req.logout();

    // set a flash message for feedback after the redirect
    req.flash('logoutSuccess', 'Log out successful.');

    res.redirect('/login');
});


// link to "/auth/facebook" to take the user to the Facebook Website for login
router.get('/auth/facebook', passport.authenticate('facebook'));
// the "/auth/facebook/callback" URL is where the user will arrive after login
router.get('/auth/facebook/callback',
            // name of strategy    settings object
            //               |      |
  passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  })
);


// link to "/auth/google" to take the user to the Facebook Website for login
router.get('/auth/google',
  passport.authenticate('google', {
    scope:[
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  })
);


// the "/auth/google/callback" URL is where the user will arrive after login
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
  })
);


module.exports = router;
