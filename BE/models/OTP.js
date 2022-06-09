const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const OTPSchema = new Schema(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "payment",
    },
    otp: {
      type: String,
    },
    createAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // 3min
    },
  },
  {
    collection: "tcat-otps",
    timestamps: true,
  }
);
OTPSchema.pre("save", function (next) {
  if (!this.isModified("otp")) return next();
  const salt = bcrypt.genSaltSync(); //round : độ phức tạp , thời gian cần 2^10
  const hashedOTP = bcrypt.hashSync(this.otp, salt);
  this.otp = hashedOTP;
  next();
});
module.exports = mongoose.model("OTP", OTPSchema);
