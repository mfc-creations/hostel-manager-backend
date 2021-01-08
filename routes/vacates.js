const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getStudents,
  searchInmates,
  studentById,
  rejoinStudent,
} = require("../controllers/vacates");

router
  .route("/:field/:skip/:limit/:sort")
  .get(passport.authenticate("hostel", { session: false }), getStudents);
router
  .route("/search/:name")
  .get(passport.authenticate("hostel", { session: false }), searchInmates);
router
  .route("/:id")
  .get(passport.authenticate("hostel", { session: false }), studentById);
router
  .route("/rejoin/:id")
  .patch(passport.authenticate("hostel", { session: false }), rejoinStudent);

module.exports = router;
