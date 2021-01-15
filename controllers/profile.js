const Hostel = require("../models/Hostel");

const validateProfileInput = require("../validation/profile");

exports.createProfile = async (req, res) => {
  console.log("do");
  console.log(req.body);
  try {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      throw errors;
    }

    const hostel = await Hostel.findById(req.user.id);
    if (!hostel) {
      throw { message: "Hostel not found" };
    }
    const profile = await Hostel.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          photo: req.body.photo,
          roomData: req.body.roomData,
        },
      },
      { new: true }
    );
    res.status(201).json({ success: true, data: profile });
    // res.status(200).json({
    //   success: true,
    //   data: [
    //     { name: "fahadc", age: 2 },
    //     { name: "mfc", age: 32 },
    //   ],
    // });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Hostel.findById(req.user.id).lean();
    console.log(profile);
    console.log("profile");

    if (!profile) {
      throw { message: "Profile not found" };
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.getRoomData = async (req, res) => {
  try {
    const roomData = await Hostel.findById(req.user.id)
      .select({ roomData: 1 })
      .lean();
    res.status(200).json({ success: true, data: roomData });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
