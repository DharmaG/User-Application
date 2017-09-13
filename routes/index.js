const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  //" req.user" is created by the passport middlewares
  // it will be "undefined" if there is no logged in user
  console.log( req.user );

  //logged in
  if (req.user){
    res.locals.roomSuccess = req.flash('roomFeedback');
    res.render('user-home.ejs');
  }

  // not logged in
  else {
    // check for feedback messages from the sign up process
    res.locals.signupFeedback = req.flash('signupSuccess');
    res.render('index');

  }
});

module.exports = router;
