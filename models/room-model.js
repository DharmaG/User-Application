const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    photoUrl: {
      type: String,
      required: true
    },
    desc: {
      type: String
    },

    // the mongo ID of the user that this room belongs to
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    //adds "createAt"and "updateAt" to the schema
    timestamps: true
  }
);

const RoomModel = mongoose.model('Room', roomSchema);

module.exports = RoomModel;
