const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PaymentSchema = new Schema(
  {
    PaymentStatus: {
      type: Boolean,
      default: false,
      required: [true, "Payment Status is required"],
    },
    ticketID: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    collection: "tcat-payments",
    timestamps: true,
  }
);
mongoose.set("runValidators", true);
module.exports = mongoose.model("Payment", PaymentSchema);
