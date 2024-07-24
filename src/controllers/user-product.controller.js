import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";
import Products from "../models/Products.js";
import formatDate from "../utils/formateDate.js";

//  Add to Wishlist
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

//  Remove from Wishlist
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
  return res.status(200).json(new ApiResponse(200, "Removed from wishlist"));
});

// Get Wishlist

const getWishlist = asyncHandler(async (req, res) => {
  const { email } = req.user; // User information from JWT
  // Find the user based on the email
  const customer = await User.findOne({ email });
  if (!customer) throw new ApiError(400, "User not found");
  return res.status(200).json({ wishlist: customer.wishlist });
});

//  Add to Cart

const addtoCart = asyncHandler(async (req, res) => {
  const { prod_name, no_of_items, options_id } = req.body;
  const { email } = req.user;
  const customer = await User.findOne({ email });
  if (!customer) throw new ApiError(400, "User not found");
  const productInCart = customer.cart.find(
    (item) => item.prod_name === prod_name && item.options_id === options_id
  );
  if (!productInCart) {
    customer.cart.push({ prod_name, no_of_items, options_id });
    await customer.save();
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "added to cart successfully"));
});

// Remove from Cart

const removeFromCart = asyncHandler(async (req, res) => {
  const { prod_name } = req.body;
  const { email } = req.user; // User information from JWT
  const customer = await User.findOne({ email });
  if (!customer) throw new ApiError(200, "User not found");
  customer.cart = customer.cart.filter((item) => item.prod_name !== prod_name);
  await customer.save();
  return res.status(200).json(new ApiResponse(200, "Removed from cart"));
});

// Get cart

const getCart = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const customer = await User.findOne({ email });
  if (!customer) throw new ApiError(200, "User not found");
  return res.status(200).json({ cart: customer.cart });
});

// Purchase Module

const purchaseModule = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  const { email } = req.user;

  // Validate request body
  if (!addressId) throw new ApiError(400, "Missing addressId");
  const user = await User.findOne({ email });
  const addressObj = user.addresses.id(addressId);
  const address = ` ${addressObj.name}  ${addressObj.phone}  ${addressObj.locality}, ${addressObj.city}  ${addressObj.state} - ${addressObj.pincode}, Landmark: ${addressObj.landmark}`;
  const cartItems = user.cart;
  let total_price = 0;
  let orderProducts = [];

  for (const cartItem of cartItems) {
    const { prod_name, options_id, no_of_items } = cartItem;
    // Find the product and the corresponding option
    const product = await Products.findOne({
      "subCategories.products.prod_name": prod_name,
      "subCategories.products.options._id": options_id,
    });

    if (!product) throw new ApiError(400, `Product not found: ${prod_name}`);

    let foundProduct, foundOption;
    // Locate the specific product and option
    for (const subCategory of product.subCategories) {
      foundProduct = subCategory.products.find(
        (p) => p.prod_name === prod_name
      );
      if (foundProduct) {
        foundOption = foundProduct.options.id(options_id);
        if (foundOption) break;
      }
    }
    if (!foundProduct || !foundOption) {
      return res
        .status(404)
        .json({ message: `Option not found for product: ${prod_name}` });
    }

    // Calculate price including discount
    const discountedPrice =
      foundOption.price * (1 - foundOption.discount / 100);
    const price = discountedPrice * no_of_items;
    total_price += price;
    // Adjust available_stock and sold_stock based on purchased quantity
    foundOption.available_stock -= no_of_items;
    foundOption.sold_stock += no_of_items;
    await product.save();
    // Push product details to orderProducts array
    orderProducts.push({
      prod_name: foundProduct.prod_name,
      quantity: no_of_items,
      option_id: options_id,
      price: discountedPrice,
    });
  }
  const newOrder = {
    products: orderProducts,
    total_price,
    address,
    date: new Date().toISOString(),
  };
  let buyingModule = await BuyingModule.findOne({ email });
  if (!buyingModule) {
    buyingModule = new BuyingModule({
      email,
      username,
      orders: [newOrder],
    });
  } else {
    buyingModule.orders.push(newOrder);
  }

  await buyingModule.save();

  // Clear the user's cart
  user.cart = [];
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Purchase successful"));
});
export {
  addtoUserWishlist,
  removefromUserWishlist,
  getWishlist,
  addtoCart,
  removeFromCart,
  getCart,
  purchaseModule
};
