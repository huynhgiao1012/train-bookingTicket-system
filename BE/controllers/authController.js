const catchAsync = require("../middleware/async");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const EmailService = require("../utils/EmailService");
const Token = require("../models/token");
const Times = require("../models/timeAccess");
const Account = require("../models/account");
// var randomstring = require("randomstring");
// var generator = require('generate-password');
const { findByIdAndUpdate } = require("../models/timeAccess");

exports.register = catchAsync(async (req, res) => {
  const { name, email, dob, address, phone, password, idCard } = req.body;

  const account = await Account.create({
    name,
    email,
    dob,
    address,
    phone,
    password,
    idCard,
  });
  // await EmailService.sendMail("zumzum.no113@gmail.com", "Congrat!!", "Welcome to our app");
  res.status(201).json({ success: true, data: account });
});
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existEmail = await Account.findOne({ email });
  if (!existEmail) {
    throw new ApiError(400, "Email or password is incorrect");
  }
  const isMatch = bcrypt.compareSync(password, existEmail.password);

  if (!isMatch) {
    const timeAccess = await Times.findOne({ userId: existEmail._id });
    if (!timeAccess) {
      await Times.create({
        userId: existEmail._id,
        times: 1,
      });
      throw new ApiError(400, "Wrong password. You have 6 times more");
    } else {
      if (timeAccess.times === 6) {
        throw new ApiError(400, "Account is disabled for a while");
      } else {
        timeAccess.times += 1;
        await timeAccess.save();
        throw new ApiError(
          400,
          `Wrong password. You have ${6 - timeAccess.times + 1} times more`
        );
      }
    }
  }
  if (isMatch) {
    const timeAccess = await Times.findOne({ userId: existEmail._id });
    if (!timeAccess || timeAccess.times < 6) {
      const token = jwt.sign(
        {
          email: existEmail.email,
          name: existEmail.name,
          role: existEmail.role,
          id: existEmail._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({
        success: true,
        token,
      });
    } else {
      throw new ApiError(400, "Account is disabled for a while");
    }
  }
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { email } = req.user;
  const { oldPassword, newPassword } = req.body;
  const existEmail = await Account.findOne({ email: email });
  if (!existEmail) {
    throw new ApiError(400, "Email have no longer exists");
  }
  const isMatch = bcrypt.compareSync(oldPassword, existEmail.password);
  if (!isMatch) {
    throw new ApiError(400, "Old password does not match");
  } else {
    existEmail.password = newPassword;
    existEmail.save();
  }
  console.log(existEmail);
  res.json({
    success: true,
    message: "Change successfully !",
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { userId, token } = req.query;
  const { newPassword } = req.body;
  const tokenUser = await Token.findOne({ userId });
  const isValid = bcrypt.compareSync(token, tokenUser.token);
  if (!userId || !token || !tokenUser || !isValid) {
    throw new ApiError(400, "Invalid token and id");
  }
  if (!newPassword) {
    throw new ApiError(400, "Please type new password");
  }
  const user = await Account.findById(userId);
  user.password = newPassword;
  const result = await user.save();
  if (result) {
    await tokenUser.remove();
  }
  // await Promise.all([user.save(), tokenUser.remove()]);//ko thực hiện cùng lúc đc
  await EmailService.sendMail(
    process.env.EMAIL,
    user.email,
    "[FROM TCAT COMPANY] - Success Reset password",
    "Your password is successfully reset"
  );
  res.status(200).json({
    success: true,
    message: "Your password is successfully reset !",
  });
});
exports.forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Please enter an email");
  }
  const existEmail = await Account.findOne({ email });
  if (!existEmail) {
    throw new ApiError(400, "Email have no longer exists");
  }

  const tokenReset = crypto.randomBytes(32).toString("hex");
  const salt = bcrypt.genSaltSync();
  const hashToken = bcrypt.hashSync(tokenReset, salt);
  await Token.create({
    userId: existEmail._id,
    token: hashToken,
  });
  const link = `${process.env.FRONT_END_URL}:5500/FE/ResetPassword.html?token=${tokenReset}&userId=${existEmail._id}`;
  await EmailService.sendMail(
    process.env.EMAIL,
    email,
    "[Reset password] - FROM TCAT COMPANY",
    `Here is the link to reset your password: ${link}`
  );
  res.status(200).json({
    success: true,
    message: "Your link reset have already been sent to your email",
  });
});

exports.home = catchAsync(async (req, res) => {
  res.json({
    success: true,
  });
});
