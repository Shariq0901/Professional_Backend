import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  addUserAddress,
} from "../../controllers/user.controller.js";
import {
  authJwt,
  registerValidation,
} from "../../middlewares/authMiddlewares.js";
import { addtoUserWishlist,removefromUserWishlist } from "../../controllers/user-product.controller.js";
const router = Router();

router.route("/register").post(registerValidation, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authJwt, logoutUser);
router.route("/address").put(authJwt, addUserAddress);
router.route("/addToWishList").put(authJwt, addtoUserWishlist)
router.route("/removefromWishlist").delete(authJwt, removefromUserWishlist)

export default router;
