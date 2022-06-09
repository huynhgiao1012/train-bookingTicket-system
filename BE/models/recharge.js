const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RechargeSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    cardNum: {
      type: String,
      required: [true, "Card number is required"],
      minlength: [16, "Must have at least 16 numbers"],
      maxlength: [19, "Must have at least 19 numbers"],
      match: /[0-9]*/,
    },
    CVV: {
      type: Number,
      required: [true, "CVV is required"],
      minlength: [3, "Must have at least 3 numbers"],
      maxlength: [4, "Must have maximum 4 numbers"],
      match: /[0-9]*/,
    },
    expiredDate: {
      type: Date,
      requried: [true, "Expired Date is requried"],
    },
  },
  {
    collection: "tcat-tickets",
    timestamps: true,
  }
);
mongoose.set("runValidators", true);
module.exports = mongoose.model("Recharge", RechargeSchema);
