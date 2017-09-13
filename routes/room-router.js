const express = require('express');

const RoomModel = require('../models/room-model.js')

const router = express.Router();


router.get('/rooms/new', (req, res, next) => {
  // redirect to the log in page if NOT logged in
  if (req.user === undefined) {
    req.flash('securityError', 'Log in to add a room.');
    res.redirect('/login');
    return;
  }
  res.render('room-views/room-form.ejs');
});

//<form method="post" action="/rooms">
router.post('/rooms', (req, res, next) => {
  if (req.user === undefined) {
    req.flash('securityError', 'Log in to add a room.');
    res.redirect('/login');
    return;
  }

  const theRoom = new RoomModel({
    name: req.body.roomName,
    photoUrl: req.body.roomPhoto,
    desc: req.body.roomDesc,
    owner: req.user._id
  }); //
      // Logged in user's ID from passport
      //(passport defines "req.user")

  theRoom.save((err) => {
    if (err) {
      next(err);
      return;
    }

    req.flash('roomFeedback', 'Room added');

    res.redirect('/');
  });

});



router.get('/my-rooms', (req, res, next) => {

  if (req.user === undefined) {
    req.flash('securityError', 'Log in to add a room.');
    res.redirect('/login');
    return;
  }

  // find all the ROOMS whose owner is the logged in user
  RoomModel.find(
    { owner: req.user._id },

    (err, myRooms) => {
      if (err) {
        next(err);
        return;
      }

      res.locals.listOfRooms = myRooms;

      res.render('room-views/user-rooms.ejs');
    }
  );
}); // close GET /my-rooms


module.exports = router;
