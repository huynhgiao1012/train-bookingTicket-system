const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SeatSchema = new Schema(
  {
    Seatnumber: {
      type: Number,
      required: [true, "Seat Status is required"],
    },
    SeatStatus: {
      type: Boolean,
      default: true,
      required: [true, "Seat Status is required"],
    },
    tripID: {
      type: mongoose.Types.ObjectId,
      ref: "Trip",
    },
  },
  {
    collection: "tcat-seats",
    timestamps: true,
  }
);
mongoose.set("runValidators", true);
module.exports = mongoose.model("Seat", SeatSchema);
