const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TicketSchema = new Schema(
  {
    price: {
      type: Number,
      require: [true, "Price is required"],
    },
    Seatnumber: {
      type: Number,
    },
    tripID: {
      type: mongoose.Types.ObjectId,
      ref: "Trip",
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "tcat-tickets",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
TicketSchema.virtual("seat_detail", {
  ref: "Seat",
  localField: "Seatnumber",
  foreignField: "Seatnumber",
  justOne: true,
});
mongoose.set("runValidators", true);
module.exports = mongoose.model("Ticket", TicketSchema);
