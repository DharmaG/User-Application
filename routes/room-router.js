const express = require('express');
const multer = require('multer');

const RoomModel = require('../models/room-model.js')

const router = express.Router();

const myUploader = multer(
  // 1 argument -> a settings object
  {
    dest: __dirname + '/../public/uploads/'
  }  //
    // destination (where to put uploaded files)
);


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
router.post(
  '/rooms',

  myUploader.single('roomPhoto'),
    //                  |
  //  <input   name="roomPhoto" type="file">

  (req, res, next) => {
  if (req.user === undefined) {
    req.flash('securityError', 'Log in to add a room.');
    res.redirect('/login');
    return;
  }

  // muler creates "req.file" with all the uploaded file information
  console.log( 'req.file (created by multer) ------------- ');
  console.log( req.file );

  const theRoom = new RoomModel({
    name: req.body.roomName,
    photoUrl: '/uploads/' + req.file.filename,
                            //'req.file.filename' is automatically
                            // generated name for the uploaded file
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

}); // close ///rooms



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
      res.locals.securityFeedback = req.flash('securityError');
      res.locals.updateFeedback = req.flash('updateSuccess');
      res.locals.listOfRooms = myRooms;

      res.render('room-views/user-rooms.ejs');
    }
  );
}); // close GET /my-rooms

router.get('/rooms/:roomId/edit', (req, res, next) => {
  RoomModel.findById(
    req.params.roomId,

    (err, roomFromDb) => {
      if(err) {
        next(err);
        return;
      }

      //redirect if you don't own this room
      console.log(req.user);
      if (roomFromDb.owner.toString() !== req.user._id.toString()) {
        req.flash('securityError', 'You can only eit your rooms.');
        res.redirect('/my-rooms');
        return;
      }
      res.locals.roomInfo = roomFromDb;

      res.render('room-views/room-edit.ejs');
    }

  ); //close RoomModel.findById( ...)
}); // close GET /rooms/:roomId/edit

router.post('/rooms/:roomId', (req, res, next) => {
  RoomModel.findById(
    req.params.roomId,

    (err, roomFromDb) => {
      if (err) {
        next(err);
        return;
      }

      if (roomFromDb.owner.toString() !== req.user._id.toString()) {
        req.flash('securityError', 'You can only eit your rooms.');
        res.redirect('/my-rooms');
        return;
      }

      roomFromDb.name = req.body.roomName;
      roomFromDb.photoUrl = req.body.roomPhoto;
      roomFromDb.desc = req.body.roomDesc;

      roomFromDb.save((err) => {
        if(err) {
          next(err);
          return;
        }

        req.flash('updateSuccess', 'Room update Succesful.');
        res.redirect('/my-rooms');
      }); // close roomFromDb.save((err)...)
    }
  ); // close RoomModel.findById
}); // close POST /rooms/:roomId


module.exports = router;
