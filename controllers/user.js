import { User } from "../models/user.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import ErrorHandler from "../utils/error.js";
import cloudinary from "cloudinary";
import {
  cookieOption,
  sendToken,
  getDataUri,
  sendEmail,
} from "../utils/features.js";

export const SignUp = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, city, country, pinCode } = req.body;

  let user = await User.findOne({ email });
  if (user) next(ErrorHandler("User is already exsisted", 400));
  let avatar = null;

  if (req.file) {
    const file = getDataUri(req.file);
    console.log(file);
    const image = await cloudinary.v2.uploader.upload(file.content);
    avatar = {
      public_id: image.public_id,
      url: image.secure_url,
    };
  }
  user = await User.create({  
    name,
    email,
    password,
    city,
    country,
    pinCode,
    avatar,
  });

  sendToken(user, res, "Sucessfully resgistered", 201);
});

export const Login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(ErrorHandler("No User Found", 401));

  const isMatched = await user.comparePassword(password);

  if (isMatched) sendToken(user, res, `Welcome back , ${user.name}`, 200);

  if (!isMatched) return next(ErrorHandler("Password is not match", 401));
});

export const getProfile = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const Logout = asyncErrorHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOption, expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Sucessfully logout.",
    });
});

export const updatePic = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const file = getDataUri(req.file);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  const image = await cloudinary.v2.uploader.upload(file.content);

  user.avatar = {
    public_id: image.public_id,
    url: image.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile pic updated",
  });
});

export const changeProfile = asyncErrorHandler(async (req, res, next) => {
  const { name, email, city, country, pinCode } = req.body;
  const user = await User.findById(req.user._id);

  let avatar = null;

  if (name) user.name = name;
  if (email) user.email = email;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;
  if (req.file) {
    const file = getDataUri(req.file);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    const image = await cloudinary.v2.uploader.upload(file.content);
    avatar = {
      public_id: image.public_id,
      url: image.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully updated!",
  });
});

export const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!oldPassword || !newPassword)
    return next(ErrorHandler("Missing requested field", 400));

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) next(ErrorHandler("Password is not match", 400));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    sucess: true,
    message: "Password Changed",
  });
});

export const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(ErrorHandler("No User Found!", 400));

  const opt = Math.floor(100000 + Math.random() * 900000);
  const opt_expire = 15 * 60 * 1000;

  user.opt = opt;
  user.opt_expire = new Date(Date.now() + opt_expire);

  await user.save();

  try {
    const message = `This is the OTP for resetting password. Your OTP is ${user.opt} and it will expire in ${user.opt_expire} Please ignore you do not requested for this.`;
    sendEmail("OPT for resetting password", user.email, message);
  } catch (err) {
    user.otp = null;
    user.opt_expire = null;
    await user.save();
    next(err);
  }

  res.status(200).json({
    sucess: true,
    message: "Please check your email for verfication code.",
  });
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { opt, password } = req.body;

  const user = await User.findOne({
    opt,
    opt_expire: {
      $gt: Date.now(),
    },
  });

  if (!user) return next(ErrorHandler("OTP is not correct or expired!", 401));
  if (!password) return next(ErrorHandler("Please enter a new password", 401));

  user.password = password;
  user.opt = undefined;
  (user.opt_expire = undefined), await user.save();

  res.status(200).json({
    success: true,
    message: "Password is updated!",
  });
});
