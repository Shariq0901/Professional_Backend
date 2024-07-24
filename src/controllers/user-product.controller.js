import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Products from "../models/Products.js";
import formatDate from "../utils/formateDate.js";

const addtoUserWishlist = asyncHandler(async (req, res) => {
  const { prod_name } = req.body;
  const { email } = req.user; // User information from JWT
  // Find the user based on the email
  const customer = await User.findOne({ email }); // Assuming you have a Customer model
  if (!customer) throw new ApiError(404, "User not found");
  // Add the book to the wishlist if it's not already there
  if (!customer.wishlist.includes(prod_name)) {
    customer.wishlist.push(prod_name);
    await customer.save();
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Product added Successfully"));
});
const removefromUserWishlist = asyncHandler(async (req, res) => {
  const { prod_name } = req.body;
  const { email } = req.user; // User information from JWT
  const customer = await User.findOne({ email }); // Assuming you have a Customer model
  if (!customer) throw new ApiError(404, "User not found");
  // Remove the book from the wishlist if it exists
  const index = customer.wishlist.indexOf(prod_name);
  if (index > -1) {
    customer.wishlist.splice(index, 1);
    await customer.save();
    }
    return res.status(200).json(new ApiResponse(200,"Removed from wishlist"))
});

export { addtoUserWishlist, removefromUserWishlist };
