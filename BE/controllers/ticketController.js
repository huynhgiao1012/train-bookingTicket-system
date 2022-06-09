const Ticket = require("../models/ticket");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../middleware/async");
const otpGenerator = require("otp-generator");
const EmailService = require("../utils/EmailService");
const bcrypt = require("bcryptjs");
const trip = require("../models/trip");
const seat = require("../models/seat");
const account = require("../models/account");
const payment = require("../models/payment");
const otp = require("../models/OTP");
exports.bookTicket = catchAsync(async (req, res) => {
  const { tripID, Seatnumber } = req.body;
  const userId = req.user.id;
  const findtrip = await trip.findOne({ tripID: tripID });
  const seatOfTrip = await seat.find({
    tripID,
    Seatnumber,
  });
  if (seatOfTrip[0].SeatStatus) {
    const ticket = await Ticket.create({
      Seatnumber,
      price: findtrip.price,
      tripID,
      userID: userId,
    });
    seatOfTrip[0].SeatStatus = false;
    seatOfTrip[0].save();
    res.json({
      success: true,
      data: ticket,
    });
  } else {
    throw new ApiError(400, "The seat of is not available");
  }
});
exports.getTicket = catchAsync(async (req, res) => {
  const data = await Ticket.find({})
    .populate("userID", "name email address phone -_id")
    .populate("tripID", "source destination Date StartTime EndTime -_id");
  res.status(200).json({
    success: true,
    data,
  });
});
exports.searchTicketByMail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const inputUser = await account.findOne({ email: email });
  const data = await Ticket.find({ userID: inputUser._id })
    .populate("userID", "name email address phone -_id")
    .populate("tripID", "source destination Date StartTime EndTime -_id");
  res.status(200).json({
    success: true,
    data,
  });
});
exports.deleteTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  const pm = await payment.findOne({ ticketID: id });
  if (!ticket) {
    throw new ApiError(400, "This ticket is not available");
  }
  await ticket.remove();
  await pm.remove();
  const currentSeat = await seat.find({
    tripID: ticket.tripID,
    Seatnumber: ticket.Seatnumber,
  });
  currentSeat[0].SeatStatus = true;
  currentSeat[0].save();
  res.status(200).json({
    success: true,
    message: "Delete successfully !",
  });
});
exports.getUnpaidTicket = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const ticket = await Ticket.find({ userID: userId, isPaid: false }).populate(
    "tripID",
    "source destination Date StartTime EndTime -_id"
  );
  if (!ticket) {
    throw new ApiError(400, "This ticket is not available");
  }
  res.status(200).json({
    success: true,
    data: ticket,
  });
});
exports.getPaidTicket = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const ticket = await Ticket.find({ userID: userId, isPaid: true }).populate(
    "tripID",
    "source destination Date StartTime EndTime -_id"
  );
  if (!ticket) {
    throw new ApiError(400, "This ticket is not available");
  }
  res.status(200).json({
    success: true,
    data: ticket,
  });
});
exports.checkBalance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const user = await account.findById(userId);
  const ticket = await Ticket.findById(id);
  if (user.balance < ticket.price) {
    throw new ApiError(400, "The balance is not enough");
  } else {
    var otpcode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const pay = await payment.findOne({ ticketID: ticket._id });
    if (!pay) {
      await payment.create({
        ticketID: ticket._id,
      });
      const pm = await payment.findOne({ ticketID: ticket._id });
      await otp.create({
        paymentId: pm._id,
        otp: otpcode,
      });
    } else {
      const pm = await payment.findOne({ ticketID: ticket._id });
      const getOtp = await otp.findOne({ paymentId: pm._id });
      if (getOtp) {
        getOtp.otp = otpcode;
        getOtp.save();
      } else {
        await otp.create({
          paymentId: pm._id,
          otp: otpcode,
        });
      }
    }
    await EmailService.sendMail(
      process.env.EMAIL,
      user.email,
      "[OTP verification] - FROM TCAT COMPANY",
      `Your OTP code: ${otpcode}`
    );
    res.status(200).json({
      success: true,
      message: "Check your mail for OTP code",
    });
  }
});
exports.payTicket = catchAsync(async (req, res) => {
  const { OTP } = req.body;
  const { id } = req.params; //paymentID
  const pid = await payment.findOne({ ticketID: id });
  console.log(pid);
  const userId = req.user.id;
  const user = await account.findById(userId);
  // check OTP code
  const saveOtp = await otp.findOne({ paymentId: pid._id });
  const isMatch = bcrypt.compareSync(OTP, saveOtp.otp);
  if (!isMatch) {
    // different
    throw new ApiError(400, "OTP code is not corrrect !");
  } else {
    // same
    const paymentId = saveOtp.paymentId; // get paymentId
    const PaymenT = await payment.findById(paymentId); //get current payment
    const ticket = await Ticket.findById(PaymenT.ticketID); // get ticket based on ticketID
    const newBalance = user.balance - ticket.price;
    await account.findByIdAndUpdate(userId, { balance: newBalance });
    ticket.isPaid = true;
    ticket.save();
    PaymenT.PaymentStatus = true;
    PaymenT.save();
    await saveOtp.remove();
    res.status(200).json({
      success: true,
      message: "Payment successfully !",
    });
    await saveOtp.remove();
  }
});
