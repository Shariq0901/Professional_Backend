// import { Router } from "express";
// import {
//   loginUser,
//   registerUser,
//   logoutUser,
//   addUserAddress,
// } from "../../controllers/user.controller.js";
// import {
//   authJwt,
//   registerValidation,
// } from "../../middlewares/authMiddlewares.js";
// import {
//   addtoUserWishlist,
//   removefromUserWishlist,
//   getWishlist,
//   addtoCart,
//   removeFromCart,
//   getCart,
//   purchaseModule,
  
// } from "../../controllers/user-product.controller.js";
const { Router } = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  addUserAddress,
} = require("../../controllers/user.controller.js");
const {
  authJwt,
  registerValidation,
} = require("../../middlewares/authMiddlewares.js");
const {
  addtoUserWishlist,
  removefromUserWishlist,
  getWishlist,
  addtoCart,
  removeFromCart,
  getCart,
  purchaseModule,
} = require("../../controllers/user-product.controller.js");

const router = Router();
router.route("/register").post(registerValidation, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authJwt, logoutUser);
router.route("/address").put(authJwt, addUserAddress);
router.route("/addToWishList").put(authJwt, addtoUserWishlist)
router.route("/removefromWishlist").delete(authJwt, removefromUserWishlist)
router.route("/wishlist").get(authJwt,getWishlist )
router.route("/addToCart").put(authJwt, addtoCart);
router.route("/removeFromCart").delete(authJwt, removeFromCart);
router.route("/getCart").get(authJwt, getCart);
router.route("/purchase").post(authJwt, purchaseModule);

module.exports= router;
