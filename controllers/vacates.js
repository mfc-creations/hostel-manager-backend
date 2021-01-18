const Students = require("../models/Students");
const Hostel = require("../models/Students");

exports.getStudents = async (req, res) => {
  try {
    const { field, skip, limit, sort } = req.params;
    console.log(typeof skip);
    // const jk=req.params.field
    if (field === "admissionNumber") {
      const [students, total] = await Promise.all([
        Students.find({ hostel: req.user.id, inmate: false })
          .sort({ admissionNumber: sort })
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .select({ doa: 1, name: 1, phone: 1, room: 1, admissionNumber: 1 })
          .lean(),
        Students.find({ hostel: req.user.id, inmate: false }).countDocuments(),
      ]);
      res.status(200).json({ success: true, data: { total, students } });
    } else {
      const [students, total] = await Promise.all([
        Students.find({ hostel: req.user.id, inmate: false })
          .collation({ locale: "en" })
          .sort({ name: sort })
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .select({ doa: 1, name: 1, phone: 1, room: 1, admissionNumber: 1 })
          .lean(),
        Students.find({ hostel: req.user.id, inmate: false }).countDocuments(),
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
        { inmate: false },
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

exports.rejoinStudent = async (req, res) => {
  try {
    const [student, room] = await Promise.all([
      Students.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            inmate: true,
            doa: req.body.doa,
            room: req.body.room,
          },
        },
        { new: true }
      ),
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
