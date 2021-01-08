const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  addTransaction,
  getByYear,
  transactionById,
  editTransaction,
  deleteTransaction,
  totalBalance,
} = require("../controllers/accounts");

router
  .route("/")
  .post(passport.authenticate("hostel", { session: false }), addTransaction);
router
  .route("/:year")
  .get(passport.authenticate("hostel", { session: false }), getByYear);
router
  .route("/transaction/:id")
  .get(passport.authenticate("hostel", { session: false }), transactionById)
  .patch(passport.authenticate("hostel", { session: false }), editTransaction);
router
  .route("/delete/:id")
  .patch(
    passport.authenticate("hostel", { session: false }),
    deleteTransaction
  );

router
  .route("/total/amounts")
  .get(passport.authenticate("hostel", { session: false }), totalBalance);
module.exports = router;
