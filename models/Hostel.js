const mongoose = require("mongoose");

const Hostel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required:true
  },
  photo: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  roomData: [
    {
      room: {
        type: String,
        required: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      count: {
        type: Number,
        default: 0,
      }, 
      available: {
        type: Number,
        default: 0,
      },
    },
  ],
});
module.exports = mongoose.model("hostels", Hostel);
