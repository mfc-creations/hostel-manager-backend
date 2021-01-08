const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
// const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");

dotenv.config({ path: "./config/config.env" });

connectDB();

const Hostel = require("./routes/auth");
const Profile = require("./routes/profile");
const Student = require("./routes/student");
const Vacate = require("./routes/vacates");
const Accounts = require("./routes/accounts");

// const HostelAccount = require("./routes/hostel/admin/accounts");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// app.use(cors());

app.use("/api/v1/auth", Hostel);
app.use("/api/v1/profile", Profile);
app.use("/api/v1/students", Student);
app.use("/api/v1/vacates", Vacate);
app.use("/api/v1/accounts", Accounts);

// app.use("/api/hostel/admin/accounts", HostelAccount);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
