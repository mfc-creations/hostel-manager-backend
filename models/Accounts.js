// TODO:Create index

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Accounts = new Schema({
  hostel: {
    type: Schema.Types.ObjectId,
    ref: "Hostels",
  },
  date: {
    type: Date,
  },
  item: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
  },
  expense: {
    type: Number,
  },
  remark: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  attachments: [],
});
module.exports = mongoose.model("Accounts", Accounts);
