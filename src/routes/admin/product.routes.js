import {
  addProduct,
  getProducts,
} from "../../controllers/product.controller.js";
import { Router } from "express";
const router = Router();
router.route("/add-Product").post(addProduct);
router.route("/Products").get(getProducts);
export default router;
