const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  // newAdmissionNumber,
  checkAdmissionNumber,
  addStudents,
  // editStudent,
  // vacateStudent,
  // rejoin,
  getStudents,
  searchInmates,
  studentById,
  vacateStudent,
  payFee,
  feeDetails,
} = require("../controllers/students");

router
  .route("/add")
  .post(passport.authenticate("hostel", { session: false }), addStudents);
router
  .route("/adnumber/:admissionNumber")
  .get(
    passport.authenticate("hostel", { session: false }),
    checkAdmissionNumber
  );

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
  .route("/vacate/:id/:room")
  .patch(passport.authenticate("hostel", { session: false }), vacateStudent);
router
  .route("/payfee/:id/")
  .patch(passport.authenticate("hostel", { session: false }), payFee);
router
  .route("/fee")
  .get(passport.authenticate("hostel", { session: false }), feeDetails);
// router
//   .route("/:id")
//   .patch(passport.authenticate("hostel", { session: false }), editStudent);

// router
//   .route("/admissionnumber")
//   .get(
//     passport.authenticate("hostel", { session: false }),
//     newAdmissionNumber
//   );

module.exports = router;
