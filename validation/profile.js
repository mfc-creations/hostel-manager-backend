const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.roomData = !isEmpty(data.roomData) ? data.roomData : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone is required";
  }
  // if (Validator.isEmpty(data.roomData)) {
  //   errors.roomData = "Room data is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
