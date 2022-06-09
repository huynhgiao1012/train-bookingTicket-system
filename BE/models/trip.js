const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TripSchema = new Schema(
  {
    source: {
      type: String,
      required: [true, "Source is required"],
    },
    destination: {
      type: String,
      required: "Destination is required",
    },
    Date: {
      type: Date,
      required: [true, "Date is required"],
    },
    StartTime: {
      type: String,
      required: [true, "Start Time is required"],
    },
    EndTime: {
      type: String,
      required: [true, "End Time is required"],
    },
    price: {
      type: Number,
      require: [true, "Price is required"],
    },
    NumOfSeat: {
      type: Number,
      required: [true, "Number of seat is required"],
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "tcat-trips",
    timestamps: true,
  }
);
mongoose.set("runValidators", true);
module.exports = mongoose.model("Trip", TripSchema);
