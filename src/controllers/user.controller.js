// import {asyncHandler} from "../utils/asyncHandler.js";
// import {ApiError} from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { validationResult } from "express-validator";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import {formatDate} from "../utils/formateDate.js";
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/apiError.js");
const { ApiResponse } = require("../utils/apiResponse.js");
const { validationResult } = require("express-validator");
const logger = require("../utils/loggs.js");
require("regenerator-runtime/runtime");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { formatDate } = require("../utils/formateDate.js");


const registerUser = asyncHandler(async (req, res) => {
  logger.info("Request came on /api/v1/user/register")
  const { name, username, phone, email, password, userType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userExists = await User.findOne({ email, phone});
  if (userExists)
    throw new ApiError(400, "user with email or phone exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    username,
    phone,
    email,
    password: hashedPassword,
    userType,
  });
  await newUser.save();
  if (!newUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  logger.info("Request came on /api/v1/user/login");
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "There's no such user exists");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid username or password");
  const loginTimestamp = formatDate(new Date());
  user.timestamps.push({ login: loginTimestamp });
  await user.save();
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return res.status(200).json({ token: token });
});
const logoutUser = asyncHandler(async (req, res) => {
  logger.info("Request came on /api/v1/user/logout");
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "invalid User");
  const lastLoginIndex = user.timestamps.length - 1;
  if (lastLoginIndex >= 0 && !user.timestamps[lastLoginIndex].logout) {
    user.timestamps[lastLoginIndex].logout = formatDate(new Date());
    await user.save();
  }
  return res.status(200).json(new ApiResponse(200, "logout Successfull"));
});
const addUserAddress = asyncHandler(async (req, res) => {
  logger.info("Request came on /api/v1/user/address");
  const { email } = req.user;
  const { name, phone, pincode, state, city, locality, landmark } = req.body;
   const user = await User.findOne({ email });
   if (!user) return res.status(404).json({ message: "User not found" });
   user.addresses.push({
     name,
     phone,
     pincode,
     state,
     city,
     locality,
     landmark,
   });
  await user.save();
  return res.status(200).json(new ApiResponse(200,"added Address Successfully"))
});
// router.delete("/user/:id/address/:addressId", verifyToken, async (req, res) => {
//   const { id, addressId } = req.params; 
//   try {
//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const addressIndex = user.addresses.findIndex(
//       (address) => address._id.toString() === addressId
//     );
//     if (addressIndex === -1)
//       return res.status(404).json({ message: "Address not found" });

//     user.addresses.splice(addressIndex, 1);
//     await user.save();

//     res
//       .status(200)
//       .json({
//         message: "Address deleted successfully",
//         addresses: user.addresses,
//       });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
module.exports= { registerUser, loginUser, logoutUser,addUserAddress };
