const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  createProfile,
  getProfile,
  getRoomData,
} = require("../controllers/profile");

router
  .route("/")
  .patch(passport.authenticate("hostel", { session: false }), createProfile)
  .get(passport.authenticate("hostel", { session: false }), getProfile);

router
  .route("/roomdata")
  .get(passport.authenticate("hostel", { session: false }), getRoomData);
module.exports = router;
