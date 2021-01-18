const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Students = new Schema({
  hostel: {
    type: Schema.Types.ObjectId,
    ref: "Hostels",
  },
  name: {
    type: String,
    required: true,
  },
  father: {
    type: String,
  },
  admissionNumber: {
    type: Number,
  },
  doa: {
    type: String,
  },
  //   doaObject: {
  //     day: {
  //       type: Number,
  //     },
  //     month: {
  //       type: Number,
  //     },
  //     year: {
  //       type: Number,
  //     },
  //   },
  dob: {
    type: String,
  },
  blood: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  room: {
    type: String,
  },
  deposit: {
    type: String,
  },
  gender: {
    type: String,
  },
  inmate: {
    type: Boolean,
    default: true,
  },
  university: {
    type: String,
  },
  college: {
    type: String,
  },
  branch: {
    type: String,
  },
  job: {
    type: String,
  },
  office: {
    type: String,
  },
  place: {
    type: String,
  },
  photo: {
    type: String,
  },
  proof: {
    type: String,
  },
  fee: [
    {
      date: Date,
      month: String,
      year: String,
      amount: Number,
    },
  ],
  //   photoName: {
  //     type: String,
  //   },
  //   proofName: {
  //     type: String,
  //   },
  // app: {
  //   enabled: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   enabledEditing: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   password: {
  //     type: String,
  //   },
  // },
});
module.exports = mongoose.model("Students", Students);
