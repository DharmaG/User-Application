const passport = require('passport');
const UserModel = require('../models/user-model.js');

//"serializerUser" is calledwhen the user logs in
//it determines what gets saved into the session when you log in
passport.serializeUser((userFromDb, done) => {
  //tell passport we want to save the ID inside the session
  //
  done(null, userFromDb._id);
  //     |
  //   "null" as the first argument means "no error" (good)

});

//"deserializerUser" is called on every request AFTER logging in
// it tellspassport how to get the user's information
// with the contets of the session (in this case, the ID).
passport.deserializeUser((idFromBowl, done) => {
  UserModel.findById(
    idFromBowl,

    (err, userFromDb) => {
      // if there's a database error, inform passport
      if(err) {
        done(err);
        return;
      }
        // give passport the user document from the database
        //            |
      done(null, userFromDb);
        //    |
       //   "null" as the first argument means "no error" (good)

    }
  );
});


// ------------------------------------------------------------------------------------------
//
// STRATEGIES SETUP

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// "passport.use() sets up a new strategy"
passport.use(
  new LocalStrategy(
    // 1st arg -> settings object
    {
        usernameField: 'loginEmail',
        passwordField: 'loginPassword'
    },//       |               |
      //       |           names of your input fields
      //   settings defined by LocalStrategy

    // 2nd arg -> callback
    (emailValue, passValue, done) => {
        // find the user in the Db with that email
        UserModel.findOne(
          {email: emailValue},
          (err, userFromDb) => {
            if (err) {
              done(err);
              return;
            }

            // "userFromDb" will be "null" if we didn't find anything
            if(userFromDb === null) {
                // "null" here again means "no error"
                //   |   LOGIN FAILED (email is wrong)
                //   |     |
                console.log("email malo");
              done(null, false, { message: 'Email is wrong. 💩' });
              return;
            }

            //confirm that the password is correct
            const isGoodPassword = bcrypt.compareSync(passValue, userFromDb.encryptedPassword);

              if (isGoodPassword === false) {
                  // "null" here again means "no error"
                  //   |   LOGIN FAILED (password is wrong)
                  //   |     |
                  console.log("pass malo");
                done(null, false, { message: 'Password is wrong. 💩' });
                return;
              }

            // if everything works, let passport know
            done(null, userFromDb);
            //            |
            // passport takes "userFromDb" and calls "serializeUser"
          }
        ); // close UserModel.findOne( ....)
    }
  ) // close new LocalStrategy
);

const FbStrategy = require('passport-facebook').Strategy;

// "passport.use()" sets up a new strategy
passport.use(
  new FbStrategy(
    // 1st arg -> settings object
    {
        // clientID = App ID
        clientID: 'facebook app id',
        // clientSecret = App Secret
        clientSecret: 'facebook app secret',
        callbackURL: '/auth/facebook/callback'
    },

    // 2nd arg -> callback
    // gets called after a SUCCESSFUL Facebook login
    (accessToken, refreshToken, profile, done) => {
        console.log('Facebook user info:');
        console.log(profile);

        // check to see if it's the first time they log in
        UserModel.findOne(
          { facebookID: profile.id },

          (err, userFromDb) => {
              if (err) {
                  done(err);
                  return;
              }

              // if the user already has an account, GREAT! log them in.
              if (userFromDb) {
                  done(null, userFromDb);
                  return;
              }

              // if they don't have an account, make one for them.
              const theUser = new UserModel({
                  facebookID: profile.id,
                  email: profile.displayName
              });

              theUser.save((err) => {
                  if (err) {
                      done(err);
                      return;
                  }

                  // if save is successful, log them in.
                  done(null, theUser);
              });
          }
        ); // close UserModel.findOne( ...
    }
  ) // close new FbStrategy( ...
);

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
        clientID: '908251574441-b2bnuvckq6coi2h0o971bhdn62im8tli.apps.googleusercontent.com',
        clientSecret: 'QYGkHdymZ31i1ksYzQI20hxt',
        callbackURL: '/auth/google/callback'
    },

    (accessToken, refreshToken, profile, done) => {
      console.log('Google user info:');
      console.log(profile);

      // chack to see if it's the first time they log in
      UserModel.findOne(
        { googleID: profile.id },
        (err, userFromDb) => {
          if(err) {
            done(err);
            return;
          }

          // if there's already an account log them in
          if(userFromDb) {
            done(null, userFromDb);
            return;
          }

          //otherwise crete an account before logging them in
          const theUser = new UserModel({
            googleID: profile.id,
            email:profile.emails[0].value
          });

          theUser.save((err) => {
            if (err) {
              done(err);
              return;
            }

            done(null,theUser);
          });


        }
      ); // close UserModel.findOne(
    }
  ) //close new GoogleStrategy
);
