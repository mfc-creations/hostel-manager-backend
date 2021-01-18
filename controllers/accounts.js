//TODO: Didn't give condetion "deleted" in total amounts api

// Research about
// Account.findOne({ user: req.user.id })
//       .then((act) => {
//         new Account(account)
//           .save()
const ObjectID = require("mongodb").ObjectID;

const Accounts = require("../models/Accounts");

exports.addTransaction = async (req, res) => {
  try {
    const newTr = new Accounts({
      hostel: req.user.id,
      date: req.body.date,
      item: req.body.item,
      income: req.body.income,
      expense: req.body.expense,
      attachments: req.body.attaches,
      remark: req.body.remark,
    });
    const tr = await newTr.save();
    res.status(200).json({ success: true, data: tr });
    console.log(tr);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.getByYear = async (req, res) => {
  try {
    const start = new Date(
      new Date(`${req.params.year}-01-01`).setHours(00, 00, 00)
    );
    const end = new Date(
      new Date(`${req.params.year}-12-31`).setHours(23, 59, 59)
    );

    const trs = await Accounts.find({
      $and: [
        { hostel: req.user.id },
        { date: { $gte: start, $lte: end } },
        { deleted: false },
      ],
    })
      .sort({ date: 1 })
      .select({
        date: 1,
        item: 1,
        income: 1,
        expense: 1,
        totalIncome: 1,
        totalExpense: 1,
      })
      .lean();
    res.status(200).json({ success: true, data: trs });
    console.log(trs);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.transactionById = async (req, res) => {
  try {
    const trs = await Accounts.findById(req.params.id).lean();
    res.status(200).json({ success: true, data: trs });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const tr = await Accounts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          date: req.body.date,
          item: req.body.item,
          income: req.body.income,
          expense: req.body.expense,
          attaches: req.body.attaches,
          remark: req.body.remark,
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: tr });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const act = await Accounts.findByIdAndUpdate(req.params.id, {
      $set: { deleted: true },
    });
    console.log(act);
    res.status(200).json({ success: true, data: act });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.totalBalance = async (req, res) => {
  try {
    console.log(req.user.id);
    const inc = await Accounts.aggregate([
      {
        $match: { hostel: new ObjectID(req.user.id) },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: "$income",
          },
          totalExpense: {
            $sum: "$expense",
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: {
        ...inc[0],
        balance: inc[0] ? inc[0].totalIncome - inc[0].totalExpense : 0,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};
