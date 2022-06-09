const catchAsync = require("../middleware/async");
const User = require("../models/account");
const Ticket = require("../models/ticket");
const Recharge = require("../models/recharge");
var generator = require("generate-password");
const EmailService = require("../utils/EmailService");
exports.createUser = catchAsync(async (req, res) => {
  const { name, email, dob, address, phone, idCard } = req.body;
  var password = generator.generateMultiple(1, {
    length: 10,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    strict: true,
  })[0];
  const user = await User.create({
    name,
    email,
    dob,
    address,
    phone,
    password,
    idCard,
  });
  await EmailService.sendMail(
    process.env.EMAIL,
    email,
    "[TCAT COMPANY] - WELCOME NEW USER",
    `Your password is: ${password}`
  );
  res.status(200).json({
    success: true,
    data: user,
    message: "Successfull create new user",
  });
});
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(400, "This user is not available");
  }
  await user.remove();
  await Ticket.deleteMany({ userID: id });
  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, dob, address, phone, idCard } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { name, dob, address, phone, idCard },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Update successfully", data: user });
});
exports.getAllUser = catchAsync(async (req, res) => {
  const data = await User.find({});
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await User.findById(id);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getUserDetails = catchAsync(async (req, res) => {
  const id = req.user.id;
  console.log(id);
  const data = await User.findById(id);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.rechargeUserBalance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const user = await User.findById(id);
  const balance = user.balance + amount;
  const newUser = await User.findByIdAndUpdate(id, { balance }, { new: true });
  res.status(200).json({
    success: true,
    newUser,
    message: `Successful. The new balance is ${newUser.balance}`,
  });
});
exports.rechargeBalance = catchAsync(async (req, res) => {
  const { amount, cardNum, CVV, expiredDate } = req.body;
  const userID = req.user.id;
  const recharge = await Recharge.create({
    amount,
    userID,
    cardNum,
    CVV,
    expiredDate,
  });
  const user = await User.findById(userID);
  const balance = user.balance + amount;
  const newUser = await User.findByIdAndUpdate(
    userID,
    { balance },
    { new: true }
  );
  res.status(200).json({
    success: true,
    recharge,
    message: `Successful. The new balance is ${newUser.balance}`
  });
});
