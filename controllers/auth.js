const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Hostel = require("../models/Hostel");

// Load input validation
const validateSignupInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

exports.register = async (req, res) => {
  try {
    const { errors, isValid } = validateSignupInput(req.body);

    // Check validation
    if (!isValid) {
      throw errors;
    }

    const admin = await Hostel.findOne({ email: req.body.email });
    if (admin) {
      errors.email = "Email already exist";
      throw errors;
    }
    const newAdmin = new Hostel({
      email: req.body.email,
      password: req.body.password,
    });
    bcrypt.genSalt(8, (err, salt) => {
      bcrypt.hash(newAdmin.password, salt, async (err, hash) => {
        if (err) throw err;
        newAdmin.password = hash;

        const admn = await newAdmin.save();
        const payload = {
          id: admn.id,
          email: admn.email,
          verified: admn.verified,
        };
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user: payload,
            });
          }
        );
      });
    });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.login = async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      throw errors;
    }
    const { email, password } = req.body;
    const admin = await Hostel.findOne({ email });
    if (!admin) {
      errors.email = "Email not found";
      throw errors;
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const payload = {
        id: admin.id,
        email: admin.email,
        verified: admin.verified,
      };
      jwt.sign(
        payload,
        process.env.SECRET_OR_KEY,
        { expiresIn: 86400 },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            user: payload,
          });
        }
      );
    } else {
      errors.password = "Incorrect Password";
      throw errors;
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.sendVarificationMail = async (req, res) => {
  try {
    console.log(process.env.EMAIL);
    console.log(process.env.MAIL_PSWD);
    console.log(req.user);
    const userId = req.user.id;
    const username = req.user.email.split("@")[0];
    const token = jwt.sign({ userId }, process.env.SECRET_OR_KEY, {
      expiresIn: 86400,
    });
    const newLink =
      process.env.NODE_ENV === "production"
        ? "http://hostelmanager.in/verifylink/" + token
        : "http://localhost:3000/verifylink/" + token;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "hostelmanager5469@gmail.com",
        pass: process.env.MAIL_PSWD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const user = await Hostel.findById(userId, "email");
    let mailOptions = {
      from: '"HM" <hostelmanager5469@gmail.com>',
      to: user.email,
      subject: "Email Verification",
      text: "",
      html:
        '<html lang="en"><head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <meta http-equiv="X-UA-Compatible" content="ie=edge" />    <title>Hostel Manager</title></head><body>    <div style="width:312px;margin:auto;font-family: sans-serif">        <div style="text-align: center">            <img style="width:10vw;height:10vw" src="https://firebasestorage.googleapis.com/v0/b/hostel-manager-fcee6.appspot.com/o/assets%2Flogo.png?alt=media&token=41f08c7b-6339-4d9a-9756-04e2750cad80" alt="HM" />            <h4 style="margin-top:29px;color:teal;font-size: 20px">                Welcome to Hostel Manager            </h4>        </div>        <p style="margin-top:24px;font-size: 12px">            Hi <span style="font-weight: 600;">' +
        username +
        '</span>,            <br /> You are almost ready to start. You need to confirm your account by clicking the button below.        </p>        <div style="margin-top:32px;text-align: center">            <a href="' +
        newLink +
        '"><button style="   background-color: teal;        color: white;        border: none;        box-shadow: none;        outline: none;        border-radius: 3px;        width: 168px;        height: 36px;        -webkit-box-shadow: 0px 2px 3px #00000036;        box-shadow: 0px 2px 3px #00000036;        ">                    Confirm Account                </button>            </a>        </div>        <p style="margin-top:24px;font-size: 12px">            If this doesn\'t work, copy and paste the following link in your browser: ' +
        newLink +
        '        </p>        <p style="margin-top:24px;font-size: 12px">Thanks            <br />Team Hostel Manager</p>        <p style="margin-top:24px;text-align: center;font-size: 12px">            If you have any queries feel free to email us at hostelmanager5469@gmail.com       </p>           </div></body></html>',
    };
    let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      res
        .status(200)
        .json({ success: true, message: "Link successfully sent." });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.forgotPasswordMail = async (req, res) => {
  try {
    const username = req.params.email.split("@")[0];
    const email = req.params.email;
    // Create varification link with the token
    const token = jwt.sign({ email }, process.env.SECRET_OR_KEY, {
      expiresIn: 86400,
    });
    const newLink =
      process.env.NODE_ENV === "production"
        ? "http://hostelmanager.in/resetpassword/" + token
        : "http://localhost:3000/resetpassword/" + token;
    // Create reusable transporter object using the default SMTP tranport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PSWD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // Setup email data with unicode symbols
    let mailOptions = {
      from: '"HM" <hostelmanager5469@gmail.com>',
      to: req.params.email,
      subject: "Reset Password",
      text: "",
      html:
        '<html lang="en"><head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <meta http-equiv="X-UA-Compatible" content="ie=edge" />    <title>Hostel Manager</title></head><body>    <div style="width:312px;margin:auto;font-family: sans-serif">        <div style="text-align: center">            <img style="width:10vw;height:10vw" src="https://firebasestorage.googleapis.com/v0/b/hostel-manager-fcee6.appspot.com/o/assets%2Flogo.png?alt=media&token=41f08c7b-6339-4d9a-9756-04e2750cad80" alt="HM" />            <h4 style="margin-top:29px;color:teal;font-size: 20px">                Reset your password            </h4>        </div>        <p style="margin-top:24px;font-size: 12px">            Hi <span style="font-weight: 600;">' +
        username +
        '</span>,            <br /> We heared that you lost your Hostel Manager password. Sorry about that!. Press the following button to reset your password.        </p>        <div style="margin-top:32px;text-align: center">            <a href="' +
        newLink +
        '"><button style="   background-color: teal;        color: white;        border: none;        box-shadow: none;        outline: none;        border-radius: 3px;        width: 168px;        height: 36px;        -webkit-box-shadow: 0px 2px 3px #00000036;        box-shadow: 0px 2px 3px #00000036;        ">                    Reset Password                </button>            </a>        </div>        <p style="margin-top:24px;font-size: 12px">            If this doesn\'t work, copy and paste the following link in your browser: ' +
        newLink +
        '        </p>        <p style="margin-top:24px;font-size: 12px">Thanks            <br />Team Hostel Manager</p>        <p style="margin-top:24px;text-align: center;font-size: 12px">            If you have any queries feel free to email us at hostelmanager5469@gmail.com       </p>           </div></body></html>',
    };
    let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      res
        .status(200)
        .json({ success: true, message: "Link successfully sent." });
    });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.validateVarificationLink = async (req, res) => {
  try {
    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_OR_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ success: false, message: "Token not signed" });
      } else {
        if (decodedToken.userId === req.user.id) {
          const user = await Hostel.findByIdAndUpdate(
            req.user.id,
            { verified: true },
            { new: true }
          );
          // .then((user) => {
          // Create jwt payload
          const payload = {
            id: user.id,
            email: user.email,
            verified: user.verified,
          };
          // Sign token
          jwt.sign(
            payload,
            process.env.SECRET_OR_KEY,
            { expiresIn: 86400 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user: payload,
              });
            }
          );
          // });
        } else {
          res
            .status(401)
            .json({ success: false, message: "User and link doesnot match" });
        }
      }
    });
    // }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await Hostel.findOne({ email: req.params.email });
    if (user === null) {
      throw { message: "Check your email address" };
    }
    let newPassword = "";
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.params.password, salt, async (err, hash) => {
        if (err) throw err;
        newPassword = await hash;
        const pswd = await Hostel.findOneAndUpdate(
          { email: req.params.email },
          {
            $set: { password: newPassword },
          }
        );
        res.status(200).json({ success: true, message: "Password changed" });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
