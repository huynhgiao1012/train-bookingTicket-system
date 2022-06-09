const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constant");
const Schema = mongoose.Schema;
const AccountSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must have at least 3 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      require: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must have at least 6 characters"],
      maxlength: [30, "Password must be less than 30 characters"],
      match: [
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/,
        "Password must contain uppercase, special character, number",
      ],
    },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES.USER,
    },
    idCard: {
      type: String,
      minlength: [9, "ID Card must have at least 9 characters"],
      maxlength: [12, "ID Card must be less than 12 characters"],
      require: [true, "ID Card is required"],
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "tcat-accounts",
    timestamps: true,
  }
);
mongoose.set("runValidators", true);
//middleware
AccountSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(); //round : độ phức tạp , thời gian cần 2^10
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("Account", AccountSchema);
