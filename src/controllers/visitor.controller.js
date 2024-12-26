// import Contact from "../models/ContactUs.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import {ApiError} from "../utils/apiError.js";
// import {asyncHandler} from "../utils/asyncHandler.js";
const Contact = require("../models/ContactUs.js");
const { ApiResponse } = require("../utils/apiResponse.js");
const { ApiError } = require("../utils/apiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
require("regenerator-runtime/runtime");
// Contact Us Route
const contact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  const newContact = new Contact({
    name,
    phone,
    email,
    message,
  });
  await newContact.save();
  return res.status(200).json(new ApiResponse(200, "Message Sent"));
});

//  Get messages

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find({});
  if (!messages) throw new ApiError(404, "No messages found");
  res.status(200).json(messages);
});

module.exports= { contact,getMessages };
