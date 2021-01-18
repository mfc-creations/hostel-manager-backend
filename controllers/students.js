const { count } = require("../models/Students");
const Students = require("../models/Students");
const Hostel = require("../models/Hostel");
const Accounts = require("../models/Accounts");

exports.addStudents = async (req, res) => {
  try {
    console.log("roooom");
    console.log(req.body.room);
    const newStudent = new Students({
      hostel: req.user.id,
      name: req.body.name,
      father: req.body.father,
      admissionNumber: req.body.admissionNumber,
      doa: req.body.doa,
      phone: req.body.phone,
      room: req.body.room,
      deposit: req.body.deposit,
      dob: req.body.dob,
      blood: req.body.blood,
      address: req.body.address,
      email: req.body.email,
      gender: req.body.gender,
      university: req.body.university,
      college: req.body.college,
      branch: req.body.branch,
      job: req.body.job,
      office: req.body.office,
      place: req.body.place,
      photo: req.body.photo,
      proof: req.body.proof,
    });
    const { deposit } = req.body;
    const newTr = new Accounts({
      hostel: req.user.id,
      date: req.body.doa,
      item: req.body.name + " Deposit",
      income: req.body.deposit,
    });

    const [student, room] = await Promise.all([
      newStudent.save(),
      Hostel.findById(req.user.id).updateOne(
        {
          "roomData.room": req.body.room,
        },
        {
          $inc: {
            "roomData.$.available": -1,
            "roomData.$.count": 1,
          },
        }
      ),
      deposit && deposit > 0 && newTr.save(),
    ]);
    console.log(rm);
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.suggestAdmissionNumber = async (req, res) => {
  try {
    const adn = await Students.findOne({ hostel: req.user.id })
      .sort({ admissionNumber: -1 })
      .select({ admissionNumber: 1 })
      .lean();
    if (!adn) {
      console.log("adn");

      console.log(adn);
      return res.status(200).json({ success: true, data: 1 });
    }
    const adNumber = parseInt(adn.admissionNumber) + 1;
    return res.status(200).json({ success: true, data: adNumber });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
exports.checkAdmissionNumber = async (req, res) => {
  try {
    console.log(typeof req.params.admissionNumber);
    console.log(req.params);
    const student = await Students.findOne({
      hostel: req.user.id,
      admissionNumber: req.params.admissionNumber,
    });
    if (student) {
      console.log(student);
      return res.status(200).json({ success: false, message: "Already exist" });
    }
    res.status(200).json({ success: true, message: "Not exist" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const { field, skip, limit, sort } = req.params;
    console.log(typeof skip);
    // const jk=req.params.field
    if (field === "admissionNumber") {
      const [students, total] = await Promise.all([
        Students.find({ hostel: req.user.id, inmate: true })
          .sort({ admissionNumber: sort })
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .select({ doa: 1, name: 1, phone: 1, room: 1, admissionNumber: 1 })
          .lean(),
        Students.find({ hostel: req.user.id, inmate: true }).countDocuments(),
      ]);
      res.status(200).json({ success: true, data: { total, students } });
    } else {
      const [students, total] = await Promise.all([
        Students.find({ hostel: req.user.id, inmate: true })
          .collation({ locale: "en" })
          .sort({ name: sort })
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .select({ doa: 1, name: 1, phone: 1, room: 1, admissionNumber: 1 })
          .lean(),
        Students.find({ hostel: req.user.id, inmate: true }).countDocuments(),
      ]);
      res.status(200).json({ success: true, data: { total, students } });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
exports.searchInmates = async (req, res) => {
  console.log("loi");
  try {
    const students = await Students.find({
      $and: [
        { hostel: req.user.id },
        { name: { $regex: req.params.name, $options: "i" } },
        { inmate: true },
      ],
    })
      .select({ name: 1, phone: 1, room: 1 })
      .lean();
    res.status(200).json({ success: true, students });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.studentById = async (req, res) => {
  try {
    const student = await Students.findById(req.params.id).lean();
    res.status(200).json({ success: true, student });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.vacateStudent = async (req, res) => {
  try {
    const [student, room] = await Promise.all([
      Students.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            inmate: false,
          },
        },
        { new: true }
      ),
      Hostel.findById(req.user.id).updateOne(
        {
          "roomData.room": req.params.room,
        },
        {
          $inc: {
            "roomData.$.available": 1,
            "roomData.$.count": -1,
          },
        }
      ),
    ]);
    // const student = await Students.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $set: {
    //       inmate: false,
    //     },
    //   },
    //   { new: true }
    // );
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.payFee = async (req, res) => {
  try {
    const fee = await Students.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          fee: {
            date: req.body.date,
            amount: req.body.amount,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: fee });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.feeDetails = async (req, res) => {
  console.log("chel");
  try {
    const paid = [];
    const nonPaid = [];
    const students = await Students.find({
      $and: [{ hostel: req.user.id }, { doa: { $gte: req.body.date } }],
    })
      .select({ doa: 1, name: 1, phone: 1, room: 1, admissionNumber: 1 })
      .lean();
    students.map((stu) => {
      const arr = stu.fee.filter(
        (item) => item.month === req.body.month && item.year === req.body.year
      );
      if (arr.length !== 0) {
        paid.push(stu);
      } else {
        nonPaid.push(stu);
      }
      // stu.fee.map((f) => {
      //   if (f.month === req.body.month && f.year === req.body.year) {
      //     if (f.amount && f.amount > 0) {
      //       paid.push(stu)
      //     } else {

      //     }
      //   }
      // })
    });
    res.status(200).json({ success: true, data: { paid, nonPaid } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
