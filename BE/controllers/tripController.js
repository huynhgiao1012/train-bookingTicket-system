const catchAsync = require("../middleware/async");
const Trip = require("../models/trip");
const Seat = require("../models/seat");
const Ticket = require("../models/ticket");
const Payment = require("../models/payment");
const ApiError = require("../utils/ApiError");
// _id.valueOf() --> lấy id từ object id
exports.createTrip = catchAsync(async (req, res) => {
  const {
    source,
    destination,
    Date,
    StartTime,
    EndTime,
    price,
    NumOfSeat,
    isFull,
  } = req.body;
  const trip = await Trip.create({
    source,
    destination,
    Date,
    StartTime,
    EndTime,
    price,
    NumOfSeat,
    isFull,
  });
  for (let i = 0; i < NumOfSeat; i++) {
    await Seat.create({ Seatnumber: i + 1, tripID: trip._id });
  }
  res.status(200).json({
    success: true,
    data: trip,
  });
});
exports.deleteTrip = catchAsync(async (req, res) => {
  const { id } = req.params;
  const trip = await Trip.findById(id);
  const ticket = await Ticket.find({ tripID: id });
  if (!trip) {
    throw new ApiError(400, "This trip is not available");
  }
  await trip.remove();
  await Ticket.deleteMany({ tripID: id });
  await Seat.deleteMany({ tripID: id });
  for (i = 0; i < ticket.length; i++) {
    await Payment.deleteOne({ ticketID: ticket[i]._id });
  }
  res.status(200).json({
    success: true,
    data: trip,
  });
});
exports.updateTrip = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { source, destination, Date, StartTime, EndTime, price } = req.body;
  const trip = await Trip.findByIdAndUpdate(
    id,
    { source, destination, Date, StartTime, EndTime, price },
    { new: true }
  );
  res.status(200).json({ success: true, data: trip });
});
exports.getTrip = catchAsync(async (req, res) => {
  const { source, destination } = req.body;
  var data;
  if (!source && !destination) {
    data = await Trip.find({});
  } else if (source && !destination) {
    data = await Trip.find({ source });
  } else {
    data = await Trip.find({ source, destination });
  }
  if (data.length === 0) {
    throw new ApiError(400, "There is no available trip");
  }
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getAllTrip = catchAsync(async (req, res) => {
  data = await Trip.find({});
  if (data.length === 0) {
    throw new ApiError(400, "There is no available trip");
  }
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getSeat = catchAsync(async (req, res) => {
  const { tripID } = req.body;
  if (!tripID) {
    throw new ApiError(400, "There is no available trip");
  }
  data = await Seat.find({ tripID: tripID });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getTripById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await Trip.findById(id);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getSource = catchAsync(async (req, res) => {
  const data = await Trip.find();
  let newData = [];
  data.forEach((element) => {
    if (!newData.includes(element.source)) {
      newData.push(element.source);
    }
  });
  res.status(200).json({
    success: true,
    newData,
  });
});
exports.getDestination = catchAsync(async (req, res) => {
  const data = await Trip.find();
  let newData = [];
  data.forEach((element) => {
    if (!newData.includes(element.destination)) {
      newData.push(element.destination);
    }
  });
  res.status(200).json({
    success: true,
    newData,
  });
});
