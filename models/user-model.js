const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },

    // for users who did normal login with email and password
    encryptedPassword: { type: String },

    // for Facebook login users
    facebookID: { type: String },

    // for Google login users
    googleID: { type: String }
  },

  // optional settings object for this schema
  {
    // adds "createdAt" and "updatedAt" fields to the schema
    timestamps: true
  }
);

const UserModel = mongoose.model('User', userSchema);


module.exports = UserModel;
