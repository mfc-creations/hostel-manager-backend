const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  sendVarificationMail,
  validateVarificationLink,
  forgotPasswordMail,
  forgotPassword,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/sendverifylink")
  .post(
    passport.authenticate("hostel", { session: false }),
    sendVarificationMail
  );
router
  .route("/verifylink/:token")
  .post(
    passport.authenticate("hostel", { session: false }),
    validateVarificationLink
  );
router.route("/resetpasswordlink/:email").post(forgotPasswordMail);
router.route("/resetpassword/:email/:password").post(forgotPassword);

module.exports = router;
